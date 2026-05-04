import PageManager from './page-manager';

export default class AddReturnNew extends PageManager {
    onReady() {
        const $form = $('[data-new-return-form]');
        if (!$form.length) return;

        // ---------------------------------------------------------------------------
        // Hardcoded page data which mirrors the TypeScript returns-ui interface.
        // Replace with Stencil context when it is available.
        // ---------------------------------------------------------------------------
        this.pageData = {
            order: {
                id: '101',
                datePlaced: new Date('2024-01-01'),
                status: 'Completed',
                currency: 'AUD',
                isTaxInclusive: true,
                shipping: {
                    address: {
                        fullName: 'Jane Smith',
                        address1: '1-3 Smail Street',
                        city: 'Ultimo',
                        state: 'NSW',
                        zip: '2007',
                        country: 'Australia',
                    },
                    method: 'Australia Post',
                    dateShipped: 'May 15, 2024',
                    trackingNumber: '7E27315406641',
                },
                items: [
                    {
                        id: 'item-1',
                        name: 'Product Name',
                        variant: 'Blue / Black / Green',
                        sku: 'SKU-001',
                        quantity: 1,
                        returnableQuantity: 1,
                        thumbnailUrl: '',
                        totalIncTax: 123.99,
                        totalExTax: 110.71,
                    },
                    {
                        id: 'item-2',
                        name: 'Product Name',
                        variant: 'Blue / Black / Green',
                        sku: 'SKU-002',
                        quantity: 1,
                        returnableQuantity: 1,
                        thumbnailUrl: '',
                        totalIncTax: 123.99,
                        totalExTax: 110.71,
                    },
                    {
                        id: 'item-3',
                        name: 'Product Name',
                        variant: 'Blue / Black / Green',
                        sku: 'SKU-003',
                        quantity: 1,
                        returnableQuantity: 1,
                        thumbnailUrl: '',
                        totalIncTax: 123.99,
                        totalExTax: 110.71,
                    },
                ],
            },
            reasons: [
                { id: 'reason-1', nameForMerchant: 'Damaged or defective', active: true },
                { id: 'reason-2', nameForMerchant: 'Wrong item received', active: true },
                { id: 'reason-3', nameForMerchant: 'Changed my mind', active: true },
                { id: 'reason-4', nameForMerchant: 'Item not as described', active: true },
                { id: 'reason-5', nameForMerchant: 'Arrived too late', active: true },
            ],
            resolutions: [
                { resolutionType: 'Refund' },
                { resolutionType: 'Exchange' },
                { resolutionType: 'Store Credit' },
            ],
        };

        this.renderHeader();
        this.renderShippingAddress();
        this.renderShippingMethod();
        this.renderOrderLineItems();
        this.bindSubmit($form);
    }

    renderHeader() {
        const { order } = this.pageData;
        const dateLabel = order.datePlaced.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });

        document.getElementById('return-new-orderId').textContent = order.id;
        document.getElementById('return-new-statusBadge').textContent = order.status.toUpperCase();
        document.getElementById('return-new-datePlaced').textContent = `Order date: ${dateLabel}`;
    }

    renderShippingAddress() {
        const { address } = this.pageData.order.shipping;
        const shippingAddressHtml = `<h4>Shipping address</h4>
            <p>${this.escHtml(address.fullName)}</p>
            <p>${this.escHtml(address.address1)}</p>
            <p>${this.escHtml(address.city)}, ${this.escHtml(address.state)} ${this.escHtml(address.zip)}</p>
            <p>${this.escHtml(address.country)}</p>`;

        document.getElementById('return-new-shippingAddress').innerHTML = shippingAddressHtml;
    }

    renderShippingMethod() {
        const { shipping } = this.pageData.order;
        const shippingMethodHtml = `<h4>Shipping method</h4>
            <p>${this.escHtml(shipping.method)}</p>
            <p>Shipped on ${this.escHtml(shipping.dateShipped)}</p>
            <p>${this.escHtml(shipping.trackingNumber)}</p>`;

        document.getElementById('return-new-shippingMethod').innerHTML = shippingMethodHtml;
    }

    renderOrderLineItems() {
        const { order, reasons, resolutions } = this.pageData;

        const resolutionOptions = [
            '<option value="">Select a return request</option>',
            ...resolutions.map(resolution => {
                const optionValue = this.isCustomResolution(resolution) ? this.escHtml(resolution.id) : this.escHtml(resolution.resolutionType);
                const optionLabel = this.isCustomResolution(resolution) ? this.escHtml(resolution.nameForMerchant) : this.escHtml(resolution.resolutionType);
                return `<option value="${optionValue}">${optionLabel}</option>`;
            }),
        ].join('');

        const reasonOptions = [
            '<option value="">Select a return reason</option>',
            ...reasons
                .filter(reason => reason.active)
                .map(reason => `<option value="${this.escHtml(reason.id)}">${this.escHtml(reason.nameForMerchant)}</option>`),
        ].join('');

        const orderLineItemsHtml = order.items.map(item => {
            const price = new Intl.NumberFormat('en-AU', { style: 'currency', currency: order.currency }).format(item.totalIncTax);
            const thumbnailHtml = item.thumbnailUrl
                ? `<img class="newReturn-orderLineItemThumbnail" src="${this.escHtml(item.thumbnailUrl)}" alt="${this.escHtml(item.name)}">`
                : '<div class="newReturn-orderLineItemThumbnail--placeholder">No image</div>';

            return `
                <div class="newReturn-orderLineItem" data-item-id="${this.escHtml(item.id)}">
                    ${thumbnailHtml}
                    <div class="newReturn-orderLineItemInfo">
                        <p class="newReturn-orderLineItemName">${this.escHtml(item.name)}</p>
                        <p class="newReturn-orderLineItemVariant">${this.escHtml(item.variant)}</p>
                        <p class="newReturn-orderLineItemPrice">${price} x ${item.quantity}</p>
                    </div>
                    <div class="newReturn-orderLineItemControls">
                        <div class="form-increment">
                            <button class="button button--icon" type="button"
                                    data-action="dec" data-item-id="${this.escHtml(item.id)}" disabled>
                                <span class="is-srOnly">Decrease quantity</span>
                                <i class="icon" aria-hidden="true"><svg><use href="#icon-keyboard-arrow-down"></use></svg></i>
                            </button>
                            <input class="form-input form-input--incrementTotal"
                                   id="qty-${this.escHtml(item.id)}"
                                   type="tel" value="0" min="0" max="${item.returnableQuantity}"
                                   pattern="[0-9]*" aria-label="Quantity" readonly>
                            <button class="button button--icon" type="button"
                                    data-action="inc" data-item-id="${this.escHtml(item.id)}"
                                    ${item.returnableQuantity === 0 ? 'disabled' : ''}>
                                <span class="is-srOnly">Increase quantity</span>
                                <i class="icon" aria-hidden="true"><svg><use href="#icon-keyboard-arrow-up"></use></svg></i>
                            </button>
                        </div>
                        <select class="newReturn-select" id="resolution-${this.escHtml(item.id)}" aria-label="Resolution dropdown">
                            ${resolutionOptions}
                        </select>
                        <select class="newReturn-select" id="reason-${this.escHtml(item.id)}" aria-label="Return reason">
                            ${reasonOptions}
                        </select>
                    </div>
                </div>`;
        }).join('');

        document.getElementById('return-new-itemsList').innerHTML = orderLineItemsHtml;
        this.bindOrderLineItemEvents();
    }

    bindOrderLineItemEvents() {
        document.querySelectorAll('.form-increment .button--icon').forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.getAttribute('data-item-id');
                const action = button.getAttribute('data-action');
                const item = this.pageData.order.items.find(orderLineItem => orderLineItem.id === itemId);
                const quantityInput = document.getElementById(`qty-${itemId}`);
                let quantity = parseInt(quantityInput.value, 10);

                if (action === 'inc' && quantity < item.returnableQuantity) quantity++;
                else if (action === 'dec' && quantity > 0) quantity--;

                quantityInput.value = quantity;
                document.querySelector(`[data-action="dec"][data-item-id="${itemId}"]`).disabled = quantity === 0;
                document.querySelector(`[data-action="inc"][data-item-id="${itemId}"]`).disabled = quantity >= item.returnableQuantity;

                this.updateSubmitState();
            });
        });

        document.querySelectorAll('.newReturn-select').forEach(selectElement => {
            selectElement.addEventListener('change', () => this.updateSubmitState());
        });
    }

    updateSubmitState() {
        const selectedItems = this.pageData.order.items.filter(item => parseInt(document.getElementById(`qty-${item.id}`).value, 10) > 0);

        const isValid = selectedItems.length > 0 && selectedItems.every(item => (
            document.getElementById(`resolution-${item.id}`).value
            && document.getElementById(`reason-${item.id}`).value
        ));

        document.getElementById('return-new-submitBtn').disabled = !isValid;
    }

    bindSubmit($form) {
        $form.on('submit', event => {
            event.preventDefault();

            const selectedItems = this.pageData.order.items.filter(item => parseInt(document.getElementById(`qty-${item.id}`).value, 10) > 0);

            const newReturn = {
                orderId: this.pageData.order.id,
                items: selectedItems.map(item => ({
                    id: item.id,
                    quantity: parseInt(document.getElementById(`qty-${item.id}`).value, 10),
                    reasonId: document.getElementById(`reason-${item.id}`).value,
                    resolution: document.getElementById(`resolution-${item.id}`).value,
                })),
            };

            // TODO: wire up API call when available
            console.log('Submitting return:', JSON.stringify(newReturn, null, 2));
        });
    }

    isCustomResolution(resolution) {
        return 'id' in resolution;
    }

    escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
