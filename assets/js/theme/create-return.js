import PageManager from './page-manager';

export default class CreateReturn extends PageManager {
    onReady() {
        const $form = $('[data-new-return-form]');
        if (!$form.length) return;

        this.bindOrderLineItemEvents();
        this.bindSubmit($form);
    }

    bindOrderLineItemEvents() {
        // All three selects per row (qty, resolution, reason) trigger a submit-state check.
        document.querySelectorAll('.newReturn-orderLineItem select').forEach(sel => {
            sel.addEventListener('change', () => this.updateSubmitState());
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
            // TODO ORDERS-7715: invoke createReturn Storefront GQL mutation using
            // this.buildReturnInput() to get the payload.
        });
    }

    /**
     * Builds the createReturn mutation input.
     * Called by ORDERS-7715 once the Storefront GQL mutation is wired up.
     *
     * @returns {{ orderEntityId: number, additionalNote: string, items: Array }}
     */
    buildReturnInput() {
        return {
            orderEntityId: parseInt(this.context.order?.id, 10),
            additionalNote: document.querySelector('[data-new-return-note]')?.value || '',
            items: this.getSelectedItems().flatMap(itemRow => {
                const itemId = itemRow.dataset?.itemId;
                if (!itemId) return [];
                return [{
                    lineItemEntityId: parseInt(itemId, 10),
                    quantity: parseInt(document.getElementById(`qty-${itemId}`)?.value, 10),
                    resolution: document.getElementById(`resolution-${itemId}`)?.value,
                    reasonEntityId: document.getElementById(`reason-${itemId}`)?.value,
                }];
            }),
        };
    }
}
