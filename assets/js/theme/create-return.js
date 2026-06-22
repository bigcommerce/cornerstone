import PageManager from './page-manager';

export default class CreateReturn extends PageManager {
    onReady() {
        const form = document.querySelector('[data-new-return-form]');
        if (!form) return;

        this.bindOrderLineItemEvents();
        this.bindSubmit(form);
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

        const submitBtn = document.getElementById('return-new-submitBtn');
        if (submitBtn) submitBtn.disabled = !isValid;
    }

    bindSubmit(form) {
        form.addEventListener('submit', async event => {
            event.preventDefault();

            // Ignore clicks while a request is in flight
            if (this.isSubmitting) return;
            this.isSubmitting = true;

            const submitBtn = document.getElementById('return-new-submitBtn');
            if (submitBtn) submitBtn.disabled = true;

            try {
                // TODO ORDERS-7715: handle mutation errors
                await this.createReturn(this.buildReturnInput());
                this.showConfirmation();
            } finally {
                this.isSubmitting = false;
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // Storefront GraphQL `createReturn` mutation
    createReturn(input) {
        return fetch('/graphql', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.context.storefrontApiToken}`,
            },
            body: JSON.stringify({
                query: `mutation CreateReturn($input: CreateOrderReturnInput!) {
                    order {
                        return {
                            createReturn(input: $input) {
                                entityId
                                errors {
                                    __typename
                                    ... on Error {
                                        message
                                    }
                                }
                            }
                        }
                    }
                }`,
                variables: { input },
            }),
        }).then(response => response.json());
    }

    // Swaps the form view for the success confirmation view.
    showConfirmation() {
        const formView = document.querySelector('[data-new-return-view]');
        const confirmation = document.querySelector('[data-new-return-confirmation]');

        if (formView) formView.style.display = 'none';
        if (confirmation) confirmation.style.display = '';
    }

    /**
     * Builds the `CreateOrderReturnInput` payload from the selected line items.
     *
     * @returns {{ orderEntityId: number, items: Array }}
     */
    buildReturnInput() {
        return {
            orderEntityId: parseInt(this.context.order?.id, 10),
            items: this.getSelectedItems().flatMap(itemRow => {
                const itemId = itemRow.dataset?.itemId;
                if (!itemId) return [];
                return [{
                    lineItemEntityId: parseInt(itemId, 10),
                    quantity: parseInt(document.getElementById(`qty-${itemId}`)?.value, 10),
                    reasonEntityId: document.getElementById(`reason-${itemId}`)?.value,
                    requestedResolution: this.buildRequestedResolution(document.getElementById(`resolution-${itemId}`)?.value),
                }];
            }),
        };
    }

    // Maps a selected resolution value to a `RequestedResolutionInput`
    buildRequestedResolution(value) {
        const systemResolutionTypes = ['EXCHANGE', 'REFUND', 'STORE_CREDIT'];

        if (systemResolutionTypes.includes(value)) {
            return { type: value };
        }

        return { type: 'CUSTOM', customResolutionEntityId: value };
    }

    // Returns only row containers with a non-zero quantity selected.
    getSelectedItems() {
        return Array.from(document.querySelectorAll('.newReturn-orderLineItem')).filter(itemRow => {
            const itemId = itemRow.dataset?.itemId;
            if (!itemId) return false;
            const qtyInput = document.getElementById(`qty-${itemId}`);
            return qtyInput && parseInt(qtyInput.value, 10) > 0;
        });
    }
}
