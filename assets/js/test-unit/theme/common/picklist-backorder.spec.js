import PicklistBackorder from '../../../theme/common/picklist-backorder';

const detail = (overrides = {}) => ({
    product_id: 80,
    available_for_backorder: 10,
    unlimited_backorder: false,
    available_on_hand: 0,
    available_to_sell: 10,
    backorder_message_id: 0,
    purchasable: true,
    is_stock_tracked: true,
    ...overrides,
});

const selection = (overrides = {}) => ({
    product_attribute_id: 113,
    attribute_value_id: 98,
    product_id: 80,
    auto_adjust_inventory_flag: true,
    ...overrides,
});

const buildScope = (attributes = []) => {
    const fieldMarkup = attributes.map(attr => {
        const valueMarkup = (attr.values || [])
            .map(v => `<label data-product-attribute-value="${v.id}" class="form-label">${v.label || ''}</label>`)
            .join('');
        return `
            <div class="form-field" data-product-attribute="product-list">
                <label class="form-label form-label--alternate form-label--inlineSmall">${attr.name}:<span data-option-value></span></label>
                ${valueMarkup}
            </div>
        `;
    }).join('');
    const $scope = $(
        `<div>
            <div data-product-option-change>${fieldMarkup}</div>
            <div class="form-field form-field--stock">
                <p data-product-backordered></p>
                <ul class="productView-picklist-backorder" data-picklist-backorder-list style="display:none;"></ul>
            </div>
        </div>`,
    );
    $scope.appendTo(document.body);
    return $scope;
};

const oneAttr = (name, valueId, valueLabel) => [{ name, values: [{ id: valueId, label: valueLabel }] }];

describe('PicklistBackorder', () => {
    let $scope;

    afterEach(() => {
        if ($scope) {
            $scope.remove();
            $scope = null;
        }
    });

    describe('render()', () => {
        let context;

        beforeEach(() => {
            context = {
                quantityBackorderedMessage: '__QTY__ will be backordered',
                backorderMessages: [
                    { id: 1, message: '', is_default: true },
                    { id: 2, message: 'Backorder message 1' },
                ],
                showBackorderMessage: true,
            };
        });

        it('no-ops when the list container is not present in scope', () => {
            $scope = $('<div></div>').appendTo(document.body);
            const renderer = new PicklistBackorder($scope, context);

            expect(() => renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail()],
            }, 5)).not.toThrow();
        });

        it('hides the list and renders no items when payload arrays are empty', () => {
            $scope = buildScope();
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({ selected_picklist_options: [], picklist_products_details: [] }, 5);

            const $list = $('[data-picklist-backorder-list]', $scope);
            expect($list.children('li').length).toBe(0);
            expect($list.css('display')).toBe('none');
        });

        it('tolerates missing payload keys', () => {
            $scope = buildScope();
            const renderer = new PicklistBackorder($scope, context);

            expect(() => renderer.render({}, 5)).not.toThrow();
            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(0);
        });

        it('renders one line with bold attribute-name span, qty, and per-product backorder message', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'option label text'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    available_on_hand: 1,
                    available_for_backorder: 10,
                    backorder_message_id: 2,
                })],
            }, 5);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            const $name = $items.eq(0).children('span.productView-picklist-backorder-name');
            expect($name.length).toBe(1);
            expect($name.text()).toBe('Bundle 1:');
            const text = $items.eq(0).text();
            expect(text).toContain('4 will be backordered');
            expect(text).toContain('| Backorder message 1');
            expect(text).not.toContain('(');
            expect(text).not.toContain('option label text');
        });

        it('skips selections with auto_adjust_inventory_flag set to false', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection({ auto_adjust_inventory_flag: false })],
                picklist_products_details: [detail()],
            }, 5);

            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(0);
        });

        it('skips selections whose linked product is not stock-tracked (caveat 8 residue case)', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    is_stock_tracked: false,
                    available_on_hand: 5,
                    available_for_backorder: 10,
                    available_to_sell: 15,
                })],
            }, 5);

            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(0);
        });

        it('renders mainQty without clamping when unlimited_backorder is true', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    unlimited_backorder: true,
                    available_for_backorder: null,
                    available_on_hand: 0,
                    available_to_sell: 0,
                })],
            }, 7);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).toContain('7 will be backordered');
        });

        it('silently skips a selection whose product has no matching details entry', () => {
            $scope = buildScope([
                { name: 'Bundle 1', values: [{ id: 98, label: 'A' }] },
                { name: 'Bundle 2', values: [{ id: 99, label: 'B' }] },
            ]);
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [
                    selection({ product_id: 80, attribute_value_id: 98 }),
                    selection({ product_attribute_id: 114, product_id: 81, attribute_value_id: 99 }),
                ],
                picklist_products_details: [detail({ product_id: 80 })],
            }, 5);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).toContain('Bundle 1');
            expect($items.eq(0).text()).not.toContain('Bundle 2');
        });

        it('calculates independently when two selections share the same linked product', () => {
            $scope = buildScope([
                { name: 'Bundle 1', values: [{ id: 98, label: 'A' }] },
                { name: 'Bundle 2', values: [{ id: 99, label: 'B' }] },
            ]);
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [
                    selection({ product_id: 80, attribute_value_id: 98, product_attribute_id: 113 }),
                    selection({ product_id: 80, attribute_value_id: 99, product_attribute_id: 114 }),
                ],
                picklist_products_details: [detail({
                    product_id: 80,
                    available_on_hand: 2,
                    available_for_backorder: 20,
                    available_to_sell: 22,
                })],
            }, 3);

            // Independent: each selection sees the full on-hand pool independently.
            // Both: demand=3, on_hand=2 → backordered=1.
            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(2);
            expect($items.eq(0).children('span.productView-picklist-backorder-name').text()).toBe('Bundle 1:');
            expect($items.eq(0).text()).toContain('1 will be backordered');
            expect($items.eq(1).children('span.productView-picklist-backorder-name').text()).toBe('Bundle 2:');
            expect($items.eq(1).text()).toContain('1 will be backordered');
        });

        it('shows no backorder on either selection when on-hand covers demand independently', () => {
            $scope = buildScope([
                { name: 'Picklist 1', values: [{ id: 98, label: 'A' }] },
                { name: 'Picklist 2', values: [{ id: 99, label: 'B' }] },
            ]);
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [
                    selection({ product_id: 80, attribute_value_id: 98, product_attribute_id: 113 }),
                    selection({ product_id: 80, attribute_value_id: 99, product_attribute_id: 114 }),
                ],
                picklist_products_details: [detail({
                    product_id: 80,
                    available_on_hand: 1,
                    unlimited_backorder: true,
                    available_for_backorder: null,
                })],
            }, 1);

            // Independent: each selection sees on_hand=1 vs demand=1. No backorder for either.
            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(0);
        });

        it('shows no backorder when selections use distinct products with sufficient on-hand', () => {
            $scope = buildScope([
                { name: 'Picklist 1', values: [{ id: 98, label: 'A' }] },
                { name: 'Picklist 2', values: [{ id: 99, label: 'B' }] },
            ]);
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [
                    selection({ product_id: 80, attribute_value_id: 98, product_attribute_id: 113 }),
                    selection({ product_id: 81, attribute_value_id: 99, product_attribute_id: 114 }),
                ],
                picklist_products_details: [
                    detail({ product_id: 80, available_on_hand: 5, available_for_backorder: 10 }),
                    detail({ product_id: 81, available_on_hand: 5, available_for_backorder: 10 }),
                ],
            }, 3);

            // Distinct products — each has its own pool. on-hand=5 covers demand=3. No backorder.
            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(0);
        });

        it('clamps backorder to AFB independently for each selection', () => {
            $scope = buildScope([
                { name: 'Bundle 1', values: [{ id: 98, label: 'A' }] },
                { name: 'Bundle 2', values: [{ id: 99, label: 'B' }] },
            ]);
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [
                    selection({ product_id: 80, attribute_value_id: 98, product_attribute_id: 113 }),
                    selection({ product_id: 80, attribute_value_id: 99, product_attribute_id: 114 }),
                ],
                picklist_products_details: [detail({
                    product_id: 80,
                    available_on_hand: 0,
                    available_for_backorder: 5,
                    available_to_sell: 20,
                })],
            }, 4);

            // Independent: each selection sees OH=0, AFB=5, demand=4 → backordered=min(4,5)=4.
            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(2);
            expect($items.eq(0).text()).toContain('4 will be backordered');
            expect($items.eq(1).text()).toContain('4 will be backordered');
        });

        it('clamps the backordered qty to available_for_backorder', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    available_on_hand: 0,
                    available_for_backorder: 3,
                    available_to_sell: 10,
                })],
            }, 8);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).toContain('3 will be backordered');
        });

        it('does not render a line when on-hand stock covers the requested qty', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    available_on_hand: 20,
                    available_for_backorder: 10,
                    available_to_sell: 30,
                })],
            }, 5);

            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(0);
        });

        it('full-sweep clears prior rendered lines on a subsequent render with empty arrays', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail()],
            }, 5);
            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(1);

            renderer.render({ selected_picklist_options: [], picklist_products_details: [] }, 5);
            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(0);
            expect($('[data-picklist-backorder-list]', $scope).css('display')).toBe('none');
        });

        it('omits the message suffix when backorder_message_id points at the default-empty record', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({ backorder_message_id: 1 })],
            }, 5);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).not.toContain('|');
        });

        it('omits the message suffix when backorder_message_id has no matching entry', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({ backorder_message_id: 9999 })],
            }, 5);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).not.toContain('|');
        });

        it('omits the message suffix when context.backorderMessages is missing', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder(
                $scope,
                { quantityBackorderedMessage: '__QTY__ will be backordered' },
            );

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({ backorder_message_id: 2 })],
            }, 5);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).not.toContain('|');
        });

        it('rerender(qty) re-applies cached data with the new qty', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail()],
            }, 1);
            expect($('[data-picklist-backorder-list] li', $scope).eq(0).text()).toContain('1 will be backordered');

            renderer.rerender(5);
            expect($('[data-picklist-backorder-list] li', $scope).eq(0).text()).toContain('5 will be backordered');
        });

        it('rerender(qty) no-ops when no prior render has captured data', () => {
            $scope = buildScope();
            const renderer = new PicklistBackorder($scope, context);
            expect(() => renderer.rerender(5)).not.toThrow();
            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(0);
        });

        it('skips a selection when the linked product is not purchasable', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({ purchasable: false })],
            }, 5);

            expect($('[data-picklist-backorder-list] li', $scope).length).toBe(0);
        });

        it('skips the entire line when context.showQuantityOnBackorder is false', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder(
                $scope,
                { ...context, showQuantityOnBackorder: false },
            );

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    available_on_hand: 0,
                    available_for_backorder: 10,
                    backorder_message_id: 2,
                })],
            }, 5);

            const $list = $('[data-picklist-backorder-list]', $scope);
            expect($list.children('li').length).toBe(0);
            expect($list.css('display')).toBe('none');
        });

        it('still renders the backorder line when requested qty exceeds available_to_sell (clamped by available_for_backorder)', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    available_on_hand: 2,
                    available_for_backorder: 5,
                    available_to_sell: 7,
                })],
            }, 10);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).toContain('5 will be backordered');
        });

        it('renders the line when requested qty is within the linked product available_to_sell', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    available_on_hand: 2,
                    available_for_backorder: 5,
                    available_to_sell: 7,
                })],
            }, 5);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).toContain('3 will be backordered');
        });

        it('does not apply a sell-limit clamp when available_to_sell is 0 (no limit set)', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    available_on_hand: 0,
                    available_for_backorder: 100,
                    available_to_sell: 0,
                })],
            }, 50);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).toContain('50 will be backordered');
        });

        it('does not suppress unlimited-backorder products via the sell-limit gate', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder($scope, context);

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    available_on_hand: 1,
                    unlimited_backorder: true,
                    available_for_backorder: null,
                    available_to_sell: 1,
                })],
            }, 3);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            expect($items.eq(0).text()).toContain('2 will be backordered');
        });

        it('omits the message suffix when context.showBackorderMessage is false', () => {
            $scope = buildScope(oneAttr('Bundle 1', 98, 'opt'));
            const renderer = new PicklistBackorder(
                $scope,
                { ...context, showBackorderMessage: false },
            );

            renderer.render({
                selected_picklist_options: [selection()],
                picklist_products_details: [detail({
                    available_on_hand: 0,
                    available_for_backorder: 10,
                    backorder_message_id: 2,
                })],
            }, 5);

            const $items = $('[data-picklist-backorder-list] li', $scope);
            expect($items.length).toBe(1);
            const text = $items.eq(0).text();
            expect(text).toContain('5 will be backordered');
            expect(text).not.toContain('|');
            expect(text).not.toContain('Backorder message 1');
        });
    });
});
