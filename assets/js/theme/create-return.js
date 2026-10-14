import PageManager from './page-manager';

const MAX_ADDITIONAL_NOTE_LENGTH = 1000;

export default class CreateReturn extends PageManager {
    onReady() {
        const form = document.querySelector('[data-new-return-form]');
        if (!form) return;

        this.bindOrderLineItemEvents();
        this.getLineItemRows().forEach(itemRow => this.syncRowState(itemRow.dataset.itemId));
        this.updateSubmitState();
        this.bindAdditionalNoteEvents();
        this.bindSubmit(form);
    }

    announce(message) {
        const liveRegion = document.querySelector('[data-new-return-status]');
        if (liveRegion) liveRegion.textContent = message || '';
    }

    bindOrderLineItemEvents() {
        this.getLineItemRows().forEach(itemRow => {
            const itemId = itemRow.dataset.itemId;
            const qtyInput = document.getElementById(`qty-${itemId}`);
            if (!itemId || !qtyInput) return;

            // Reason / resolution selects trigger a submit-state check.
            itemRow.querySelectorAll('select').forEach(sel => {
                sel.addEventListener('change', () => this.updateSubmitState());
            });

            // Typing updates the row live, invalid inputs are rewritten on change
            qtyInput.addEventListener('input', () => this.onQuantityChange(itemId));
            qtyInput.addEventListener('change', () => {
                qtyInput.value = String(this.getQuantity(itemId));
                this.onQuantityChange(itemId);
            });

            itemRow.querySelectorAll('[data-new-return-qty-stepper] button').forEach(button => {
                button.addEventListener('click', event => {
                    event.preventDefault();
                    this.stepQuantity(itemId, button.dataset.action === 'inc' ? 1 : -1);
                });
            });

            // Up/Down arrows step the value
            qtyInput.addEventListener('keydown', event => {
                if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

                event.preventDefault();
                this.stepQuantity(itemId, event.key === 'ArrowUp' ? 1 : -1);
            });
        });
    }

    getLineItemRows() {
        return Array.from(document.querySelectorAll('.newReturn-orderLineItem'));
    }

    // Quantity as a whole number from 0 to {max returnable}. Invalid or non numeric input is treated as 0.
    getQuantity(itemId) {
        const qtyInput = document.getElementById(`qty-${itemId}`);
        if (!qtyInput) return 0;

        const raw = qtyInput.value.trim();
        if (!/^\d+$/.test(raw)) return 0;

        const max = parseInt(qtyInput.dataset.quantityMax, 10) || 0;
        return Math.min(parseInt(raw, 10), max);
    }

    // Moves the quantity by `step`, staying within 0 to {max returnable}
    stepQuantity(itemId, step) {
        const qtyInput = document.getElementById(`qty-${itemId}`);
        if (!qtyInput) return;

        const max = parseInt(qtyInput.dataset.quantityMax, 10) || 0;
        const next = Math.min(max, Math.max(0, this.getQuantity(itemId) + step));

        qtyInput.value = String(next);
        this.onQuantityChange(itemId);
    }

    onQuantityChange(itemId) {
        this.syncRowState(itemId);
        this.updateSubmitState();
    }

    // A disabled button drops out of the tab order and loses focus, so hand focus to the quantity field first.
    setStepperButtonDisabled(button, disabled, qtyInput) {
        if (!button) return;

        if (disabled && document.activeElement === button) qtyInput.focus();
        button.toggleAttribute('disabled', disabled);
    }

    // Reason and resolution only apply once a quantity is chosen; a quantity of 0 disables them.
    syncRowState(itemId) {
        const qtyInput = document.getElementById(`qty-${itemId}`);
        if (!qtyInput) return;

        const quantity = this.getQuantity(itemId);
        const max = parseInt(qtyInput.dataset.quantityMax, 10) || 0;

        ['reason', 'resolution'].forEach(name => {
            const select = document.getElementById(`${name}-${itemId}`);
            if (!select) return;

            select.disabled = quantity === 0;
        });

        qtyInput.setAttribute('aria-valuenow', String(quantity));

        const stepper = qtyInput.closest('[data-new-return-qty-stepper]');
        const decrease = stepper?.querySelector('[data-action="dec"]');
        const increase = stepper?.querySelector('[data-action="inc"]');
        this.setStepperButtonDisabled(decrease, quantity <= 0, qtyInput);
        this.setStepperButtonDisabled(increase, quantity >= max, qtyInput);
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
        // Only describe why it's inactive; when valid the button label ("Submit Return") is enough on
        // its own, so drop the description to avoid a redundant duplicate announcement.
        const isValid = hasValidItems && this.isAdditionalNoteValid();
        submitBtn.setAttribute('aria-disabled', String(!isValid));
        if (isValid) {
            submitBtn.removeAttribute('aria-describedby');
        } else {
            submitBtn.setAttribute('aria-describedby', 'return-new-submitHint-disabled');
        }
    }

    bindSubmit(form) {
        form.addEventListener('submit', async event => {
            event.preventDefault();

            // Enter inside a quantity field submits without a change event, so commit typed values first.
            this.getLineItemRows().forEach(itemRow => {
                const qtyInput = document.getElementById(`qty-${itemRow.dataset.itemId}`);
                if (qtyInput) qtyInput.value = String(this.getQuantity(itemRow.dataset.itemId));
                this.syncRowState(itemRow.dataset.itemId);
            });
            this.updateSubmitState();

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
        // The error box is a pre-existing role="alert" region; unhiding it announces the error
        // without moving focus, so keyboard/SR users stay on Submit and can retry immediately.
        this.announce('');

        const errorBox = document.getElementById('return-new-error');
        if (!errorBox) return;

        errorBox.style.display = '';
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
                    quantity: this.getQuantity(itemId),
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
        return this.getLineItemRows().filter(itemRow => {
            const itemId = itemRow.dataset?.itemId;
            return itemId && this.getQuantity(itemId) > 0;
        });
    }
}
