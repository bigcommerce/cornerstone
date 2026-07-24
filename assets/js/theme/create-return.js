import PageManager from './page-manager';

const MAX_ADDITIONAL_NOTE_LENGTH = 1000;

export default class CreateReturn extends PageManager {
    onReady() {
        const form = document.querySelector('[data-new-return-form]');
        if (!form) return;

        this.focusOnLoad();
        this.bindOrderLineItemEvents();
        this.bindAdditionalNoteEvents();
        this.bindSubmit(form);
    }

    focusOnLoad() {
        document.getElementById('newReturn-heading')?.focus();
    }

    announce(message) {
        const liveRegion = document.querySelector('[data-new-return-status]');
        if (liveRegion) liveRegion.textContent = message || '';
    }

    bindOrderLineItemEvents() {
        // All three selects per row (qty, resolution, reason) trigger a submit-state check.
        document.querySelectorAll('.newReturn-orderLineItem select').forEach(sel => {
            sel.addEventListener('change', () => this.updateSubmitState());
        });
    }

    bindAdditionalNoteEvents() {
        const noteEl = document.querySelector('[data-new-return-note]');
        if (!noteEl) return;

        noteEl.addEventListener('input', () => {
            this.renderAdditionalNoteValidation();
            this.updateSubmitState();
        });
    }

    updateSubmitState() {
        const selectedItems = this.getSelectedItems();
        const hasValidItems = selectedItems.length > 0 && selectedItems.every(itemRow => {
            const itemId = itemRow.dataset?.itemId;
            if (!itemId) return false;
            const resolutionEl = document.getElementById(`resolution-${itemId}`);
            const reasonEl = document.getElementById(`reason-${itemId}`);
            return resolutionEl && resolutionEl.value && reasonEl && reasonEl.value;
        });

        const submitBtn = document.getElementById('return-new-submitBtn');
        if (!submitBtn) return;

        // aria-disabled (not the native disabled attr) keeps the button keyboard/SR reachable while invalid.
        // The described-by hint swaps between "what to select" and "press Enter to submit".
        const isValid = hasValidItems && this.isAdditionalNoteValid();
        submitBtn.setAttribute('aria-disabled', String(!isValid));
        submitBtn.setAttribute('aria-describedby', isValid ? 'return-new-submitHint-enabled' : 'return-new-submitHint-disabled');
    }

    bindSubmit(form) {
        form.addEventListener('submit', async event => {
            event.preventDefault();

            // Block submission when the additional note exceeds the max length.
            this.renderAdditionalNoteValidation();
            if (!this.isAdditionalNoteValid()) return;

            const submitBtn = document.getElementById('return-new-submitBtn');
            // aria-disabled doesn't block submit/Enter the way the native attr would, so gate here.
            if (submitBtn?.getAttribute('aria-disabled') === 'true') return;
            if (this.isSubmitting) return;
            this.isSubmitting = true;

            const overlay = document.querySelector('[data-new-return-view] .loadingOverlay');
            if (submitBtn) submitBtn.setAttribute('aria-disabled', 'true');
            if (overlay) overlay.style.display = 'block';
            form.setAttribute('aria-busy', 'true');
            this.announce(this.context.submittingMessage);
            this.clearError();

            try {
                const response = await this.createReturn(this.buildReturnInput());
                const errorMessages = this.getErrorMessages(response);

                if (errorMessages.length) {
                    this.showError();
                    return;
                }

                this.showConfirmation();
            } catch (error) {
                this.showError();
            } finally {
                this.isSubmitting = false;
                this.updateSubmitState();
                if (overlay) overlay.style.display = '';
                form.removeAttribute('aria-busy');
            }
        });
    }

    getErrorMessages(response) {
        const transportErrors = Array.isArray(response?.errors) ? response.errors : [];
        const returnErrors = Array.isArray(response?.data?.order?.return?.createReturn?.errors)
            ? response.data.order.return.createReturn.errors
            : [];

        return transportErrors
            .concat(returnErrors)
            .map(error => error.message)
            .filter(Boolean);
    }

    showError() {
        // The error box has role="alert" (announced on display); clear the in-flight status and
        // move focus to the summary so keyboard users land on the error.
        this.announce('');

        const errorBox = document.getElementById('return-new-error');
        if (!errorBox) return;

        errorBox.style.display = '';
        errorBox.focus();
    }

    clearError() {
        const errorBox = document.getElementById('return-new-error');
        if (errorBox) errorBox.style.display = 'none';
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

    // Focus moves to the confirmation heading, which is what announces success to SR users.
    showConfirmation() {
        const formView = document.querySelector('[data-new-return-view]');
        const confirmation = document.querySelector('[data-new-return-confirmation]');

        if (formView) formView.style.display = 'none';
        if (confirmation) confirmation.style.display = '';

        document.querySelector('[data-new-return-confirmation-heading]')?.focus();
    }

    /**
     * Builds the `CreateOrderReturnInput` payload from the selected line items.
     *
     * @returns {{ orderEntityId: number, items: Array }}
     */
    buildReturnInput() {
        const input = {
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

        // Do not send the note when it is empty or a whitespace
        const additionalNote = this.getAdditionalNote();
        if (additionalNote) {
            input.note = additionalNote;
        }

        return input;
    }

    // Trimmed value of the additional-note textarea (empty string when absent).
    getAdditionalNote() {
        const noteEl = document.querySelector('[data-new-return-note]');
        return noteEl ? noteEl.value.trim() : '';
    }

    isAdditionalNoteValid() {
        return this.getAdditionalNote().length <= MAX_ADDITIONAL_NOTE_LENGTH;
    }

    // Toggles the inline error state on the additional-note field.
    renderAdditionalNoteValidation() {
        const field = document.querySelector('[data-new-return-note-field]');
        const errorEl = document.querySelector('[data-new-return-note-error]');
        const isValid = this.isAdditionalNoteValid();

        if (field) field.classList.toggle('form-field--error', !isValid);
        if (errorEl) {
            errorEl.textContent = isValid ? '' : (this.context.additionalNoteTooLongError || '');
            errorEl.style.display = isValid ? 'none' : '';
        }
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
