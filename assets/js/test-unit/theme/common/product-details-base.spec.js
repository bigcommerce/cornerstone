import ProductDetailsBase from '../../../theme/common/product-details-base';

// Build an instance without running the (DOM/event-wiring) constructor; reselectHiddenSelectedValues
// only needs this.$scope plus the real getAttributeType/getAttributeValueInput/isHiddenByStock.
const makeInstance = $scope => {
    const instance = Object.create(ProductDetailsBase.prototype);
    instance.$scope = $scope;
    return instance;
};

// out_of_stock_behavior !== 'hide_option' → isHiddenByStock() is always false, isolating the rule path.
const data = { out_of_stock_behavior: 'do_nothing', in_stock_attributes: [] };

const radioInput = (optionId, v) => `<input class="form-radio" type="radio" id="attribute_radio_${optionId}_${v.id}"
        name="attribute[${optionId}]" value="${v.id}"
        ${v.default ? 'data-default' : ''} ${v.selected ? 'checked' : ''}>
     <label data-product-attribute-value="${v.id}" class="form-label"
        for="attribute_radio_${optionId}_${v.id}">${v.label}</label>`;

const radioOption = (optionId, values) => {
    const $scope = $(
        `<div><div class="form-field" data-product-attribute="set-radio">
            ${values.map(v => radioInput(optionId, v)).join('')}
        </div></div>`,
    );
    $scope.appendTo(document.body);
    return $scope;
};

const selectOption = (values) => {
    const opts = values
        .map(v => `<option data-product-attribute-value="${v.id}" value="${v.id}"
            ${v.default ? 'data-default' : ''} ${v.selected ? 'selected' : ''}>${v.label}</option>`)
        .join('');
    const $scope = $(
        `<div><div class="form-field" data-product-attribute="set-select">
            <select>
                <option data-product-attribute-value="" value="">choose</option>
                ${opts}
            </select>
        </div></div>`,
    );
    $scope.appendTo(document.body);
    return $scope;
};

const labelFor = ($scope, valueId) => $scope.find(`[data-product-attribute-value="${valueId}"]`);

describe('ProductDetailsBase.updateAddToCartForQty()', () => {
    let $scope;
    let instance;

    const buildScope = () => $(`
        <div>
            <div id="add-to-cart-wrapper">
                <div class="alertBox alertBox--error productAttributes-message" style="display:none;">
                    <p class="alertBox-message"></p>
                </div>
            </div>
            <input class="form-input--incrementTotal" />
            <button id="form-action-addToCart"></button>
        </div>
    `).appendTo(document.body);

    // Bypass the constructor (Wishlist.load, tab/radio wiring) and test the method directly.
    const makeQtyInstance = (context, picklistViolation) => {
        const obj = Object.create(ProductDetailsBase.prototype);
        obj.$scope = $scope;
        obj.context = context;
        obj.picklistBackorder = { getSellLimitViolation: () => picklistViolation };
        return obj;
    };

    const viewModel = () => ({
        $addToCart: $('#form-action-addToCart', $scope),
        $increments: $('.form-input--incrementTotal', $scope),
    });

    afterEach(() => {
        if ($scope) {
            $scope.remove();
            $scope = null;
        }
    });

    it('re-enables Add to Cart when a picklist limit clears even though the main ATS is unknown', () => {
        $scope = buildScope();
        let violation = { name: 'Bundle 1', availableToSell: 3 };
        // Main product ATS unknown (0); only the picklist imposes a limit.
        instance = makeQtyInstance({ availableToSell: 0 }, violation);
        const vm = viewModel();

        // Qty above the picklist limit → blocked with the picklist message.
        instance.updateAddToCartForQty(5, vm);
        expect(vm.$addToCart.prop('disabled')).toBe(true);
        expect($('.productAttributes-message', $scope).attr('data-qty-limit')).toBe('true');
        expect($('.alertBox-message', $scope).text()).toContain('Bundle 1');

        // Drop qty back into range → picklist limit no longer applies.
        violation = null;
        instance = makeQtyInstance({ availableToSell: 0 }, violation);
        instance.updateAddToCartForQty(2, vm);

        expect(vm.$addToCart.prop('disabled')).toBe(false);
        expect($('.productAttributes-message', $scope).attr('data-qty-limit')).toBeUndefined();
        expect($('.productAttributes-message', $scope).css('display')).toBe('none');
    });

    it('keeps Add to Cart disabled when increments are disabled (out of stock)', () => {
        $scope = buildScope();
        $('.form-input--incrementTotal', $scope).prop('disabled', true);
        instance = makeQtyInstance({ availableToSell: 0 }, { name: 'Bundle 1', availableToSell: 3 });
        const vm = viewModel();

        instance.updateAddToCartForQty(5, vm);
        instance.picklistBackorder.getSellLimitViolation = () => null;
        instance.updateAddToCartForQty(2, vm);

        expect(vm.$addToCart.prop('disabled')).toBe(true);
    });

    it('shows the main-product limit message and ignores the picklist when the main ATS is exceeded', () => {
        $scope = buildScope();
        instance = makeQtyInstance(
            { availableToSell: 4, quantityMaxMessage: 'The maximum purchasable quantity is __QTY__' },
            { name: 'Bundle 1', availableToSell: 3 },
        );
        const vm = viewModel();

        instance.updateAddToCartForQty(6, vm);

        expect(vm.$addToCart.prop('disabled')).toBe(true);
        expect($('.alertBox-message', $scope).text()).toBe('The maximum purchasable quantity is 4');
    });
});

describe('ProductDetailsBase.updateBackorderMessage()', () => {
    let $scope;

    const backorderMessages = [
        { id: 1, message: 'Ships in 2 weeks', is_default: true },
        { id: 2, message: 'Custom delay notice' },
    ];

    const buildBackorderScope = () => $(`
        <div>
            <div data-product-backordered>
                <span data-backorder-message></span>
            </div>
        </div>
    `).appendTo(document.body);

    const makeBackorderInstance = (context, backorderedQty) => {
        const obj = Object.create(ProductDetailsBase.prototype);
        obj.$scope = $scope;
        obj.context = context;
        obj.backorderedQty = backorderedQty;
        return obj;
    };

    const backorderViewModel = () => ({
        $backordered: $('[data-product-backordered]', $scope),
        $backorderMessage: $('[data-backorder-message]', $scope),
    });

    afterEach(() => {
        if ($scope) {
            $scope.remove();
            $scope = null;
        }
    });

    it('shows the assigned message when backorder_message_id matches', () => {
        $scope = buildBackorderScope();
        const instance = makeBackorderInstance({
            showBackorderMessage: true,
            backorderMessages,
            backorderMessageId: 2,
        }, 5);

        instance.updateBackorderMessage(backorderViewModel());

        expect($('[data-backorder-message]', $scope).text()).toBe('Custom delay notice');
    });

    it('falls back to the default message when backorder_message_id is null', () => {
        $scope = buildBackorderScope();
        const instance = makeBackorderInstance({
            showBackorderMessage: true,
            backorderMessages,
            backorderMessageId: null,
        }, 5);

        instance.updateBackorderMessage(backorderViewModel());

        expect($('[data-backorder-message]', $scope).text()).toBe('Ships in 2 weeks');
    });

    it('falls back to the default message when backorder_message_id is a dangling reference', () => {
        $scope = buildBackorderScope();
        const instance = makeBackorderInstance({
            showBackorderMessage: true,
            backorderMessages,
            backorderMessageId: 9999,
        }, 5);

        instance.updateBackorderMessage(backorderViewModel());

        expect($('[data-backorder-message]', $scope).text()).toBe('Ships in 2 weeks');
    });

    it('shows nothing when backorder_message_id is null and the default message is blank', () => {
        $scope = buildBackorderScope();
        const instance = makeBackorderInstance({
            showBackorderMessage: true,
            backorderMessages: [
                { id: 1, message: '', is_default: true },
                { id: 2, message: 'Custom delay notice' },
            ],
            backorderMessageId: null,
        }, 5);

        instance.updateBackorderMessage(backorderViewModel());

        expect($('[data-backorder-message]', $scope).text()).toBe('');
    });

    it('shows nothing when showBackorderMessage is false', () => {
        $scope = buildBackorderScope();
        const instance = makeBackorderInstance({
            showBackorderMessage: false,
            backorderMessages,
            backorderMessageId: 2,
        }, 5);

        instance.updateBackorderMessage(backorderViewModel());

        expect($('[data-backorder-message]', $scope).text()).toBe('');
    });

    it('clears the message when backorderedQty is zero', () => {
        $scope = buildBackorderScope();
        const instance = makeBackorderInstance({
            showBackorderMessage: true,
            backorderMessages,
            backorderMessageId: 2,
        }, 0);

        instance.updateBackorderMessage(backorderViewModel());

        expect($('[data-backorder-message]', $scope).text()).toBe('');
    });
});

describe('ProductDetailsBase.reselectHiddenSelectedValues', () => {
    let $scope;

    afterEach(() => {
        if ($scope) {
            $scope.remove();
            $scope = null;
        }
        $(document.body).empty();
    });

    it('does NOT auto-select the next value when the hidden default has no available default to fall back to', () => {
        // Option B: b1 is the default and is selected; the rule hides b1 (default-into-conflict).
        $scope = radioOption(5, [
            {
                id: 11, label: 'b1', default: true, selected: true,
            },
            { id: 12, label: 'b2' },
        ]);
        const instance = makeInstance($scope);
        const $hidden = labelFor($scope, 11);

        instance.reselectHiddenSelectedValues([$hidden], new Set([11]), data);

        // b2 is not a default, so it must not be auto-selected.
        expect($scope.find('input[value="12"]').prop('checked')).toBe(false);
        // The hidden value must be deselected so the forbidden value can't be submitted.
        expect($scope.find('input[value="11"]').prop('checked')).toBe(false);
    });

    it('snaps back to the default value when a hidden non-default was selected and the default is available', () => {
        // Shopper selected b2 (non-default); the rule hides b2; default b1 is still available.
        $scope = radioOption(5, [
            { id: 11, label: 'b1', default: true },
            { id: 12, label: 'b2', selected: true },
        ]);
        const instance = makeInstance($scope);
        const $hidden = labelFor($scope, 12);

        instance.reselectHiddenSelectedValues([$hidden], new Set([12]), data);

        expect($scope.find('input[value="11"]').prop('checked')).toBe(true);
        expect($scope.find('input[value="12"]').prop('checked')).toBe(false);
    });

    it('does NOT move a select option onto a non-default value when the default is hidden', () => {
        $scope = selectOption([
            {
                id: 11, label: 'b1', default: true, selected: true,
            },
            { id: 12, label: 'b2' },
        ]);
        const instance = makeInstance($scope);
        const $hidden = $scope.find('option[value="11"]');

        instance.reselectHiddenSelectedValues([$hidden], new Set([11]), data);

        expect($scope.find('select').val()).not.toBe('12');
    });
});
