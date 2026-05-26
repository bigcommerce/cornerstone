import PageManager from './page-manager';

export default class AddReturnNew extends PageManager {
    onReady() {
        const $form = $('[data-new-return-form]');
        if (!$form.length) return;

        this.bindOrderLineItemEvents();
        this.bindSubmit($form);
    }

    bindOrderLineItemEvents() {
        document.querySelectorAll('.newReturn-stepperBtn').forEach(button => {
            button.addEventListener('click', () => {
                // Derive itemId from the parent row — buttons do not carry data-item-id,
                // so the [data-item-id] selector stays scoped to the row container only.
                const row = button.closest('.newReturn-orderLineItem');
                const itemId = row?.dataset?.itemId;
                if (!itemId) return;
                const action = button.getAttribute('data-action');
                const quantityInput = document.getElementById(`qty-${itemId}`);
                // max is set server-side to returnableQuantity → quantity fallback
                const maxQty = parseInt(quantityInput.max, 10) || 0;
                let quantity = parseInt(quantityInput.value, 10);

                if (action === 'inc' && quantity < maxQty) quantity++;
                else if (action === 'dec' && quantity > 0) quantity--;

                quantityInput.value = quantity;
                const stepper = button.closest('.newReturn-stepper');
                stepper.querySelector('[data-action="dec"]').disabled = quantity === 0;
                stepper.querySelector('[data-action="inc"]').disabled = quantity >= maxQty;

                this.updateSubmitState();
            });
        });

        document.querySelectorAll('.newReturn-select').forEach(selectElement => {
            selectElement.addEventListener('change', () => this.updateSubmitState());
        });

        // Disable + button on load for any item where max=0 (non-returnable)
        document.querySelectorAll('.newReturn-stepperInput').forEach(input => {
            const maxQty = parseInt(input.max, 10) || 0;
            const incBtn = input.closest('.newReturn-stepper')?.querySelector('[data-action="inc"]');
            if (incBtn && maxQty === 0) incBtn.disabled = true;
        });
    }

    updateSubmitState() {
        const selectedItems = this.getSelectedItems();
        const isValid = selectedItems.length > 0 && selectedItems.every(itemRow => {
            const itemId = itemRow.dataset?.itemId;
            if (!itemId) return false;
            const resolutionEl = document.getElementById(`resolution-${itemId}`);
            const reasonEl = document.getElementById(`reason-${itemId}`);
            return resolutionEl && resolutionEl.value && reasonEl && reasonEl.value;
        });

        document.getElementById('return-new-submitBtn').disabled = !isValid;
    }

    // Returns only row containers (not buttons) with a non-zero quantity selected.
    getSelectedItems() {
        return [...document.querySelectorAll('.newReturn-orderLineItem')].filter(itemRow => {
            const itemId = itemRow.dataset?.itemId;
            if (!itemId) return false;
            const qtyInput = document.getElementById(`qty-${itemId}`);
            return qtyInput && parseInt(qtyInput.value, 10) > 0;
        });
    }

    bindSubmit($form) {
        $form.on('submit', event => {
            event.preventDefault();

            const orderEntityId = parseInt(this.context.order?.id, 10);
            const additionalNote = document.querySelector('[data-new-return-note]')?.value || '';
            const items = this.getSelectedItems().flatMap(itemRow => {
                const itemId = itemRow.dataset?.itemId;
                if (!itemId) return [];
                return [{
                    lineItemEntityId: parseInt(itemId, 10),
                    quantity: parseInt(document.getElementById(`qty-${itemId}`)?.value, 10),
                    resolution: document.getElementById(`resolution-${itemId}`)?.value,
                    reasonEntityId: document.getElementById(`reason-${itemId}`)?.value,
                }];
            });

            // TODO ORDERS-7715: invoke createReturn Storefront GQL mutation.
            console.log('createReturn payload', { orderEntityId, additionalNote, items }); // eslint-disable-line no-console
        });
    }
}
