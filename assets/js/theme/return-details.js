import Account from './account';
import { showAlertModal } from './global/modal';

export default class ReturnDetails extends Account {
    onReady() {
        // Run the shared account-page behavior (this page is mapped to this module
        // instead of Account in app.js).
        super.onReady();

        this.root = document.querySelector('[data-return-details]');
        if (!this.root) return;

        // The cancel action is only server-rendered for open returns.
        const cancelBtn = this.root.querySelector('[data-return-cancel]');
        if (!cancelBtn) return;

        // The return's ID is the `return_id` query param the page is reached with
        // (/account.php?action=view_return&return_id={id}). It's a UUID string.
        this.returnId = new URLSearchParams(window.location.search).get('return_id');

        // Without a return ID the cancel mutation can't run, so leave the button inert.
        if (!this.returnId) return;

        cancelBtn.addEventListener('click', () => this.openCancelModal(cancelBtn));
    }

    // Confirmation modal — uses the shared alert modal (showAlertModal), the same
    // pattern used elsewhere (e.g. removing a cart item).
    openCancelModal(triggerEl) {
        const message = `${this.context.returnCancelConfirmMessage} ${this.context.returnCancelConfirmBody}`;

        showAlertModal(message, {
            icon: 'warning',
            showCancelButton: true,
            $preModalFocusedEl: $(triggerEl),
            onConfirm: () => this.confirmCancel(),
        });
    }

    async confirmCancel() {
        // Ignore repeat clicks while the request is in flight.
        if (this.isCancelling) return;
        this.isCancelling = true;

        const cancelBtn = this.root.querySelector('[data-return-cancel]');
        const overlay = this.root.querySelector('.loadingOverlay');
        if (cancelBtn) cancelBtn.disabled = true;
        if (overlay) overlay.style.display = 'block';
        this.clearError();

        try {
            const response = await this.cancelReturn(this.returnId);
            const errorMessages = this.getErrorMessages(response);

            if (errorMessages.length > 0) {
                this.showError(errorMessages.join(' '));
                return;
            }

            // Reload so the page reflects the updated return status.
            window.location.reload();
        } catch (error) {
            this.showError(this.context.genericError);
        } finally {
            this.isCancelling = false;
            if (cancelBtn) cancelBtn.disabled = false;
            if (overlay) overlay.style.display = '';
        }
    }

    showError(message) {
        const errorBox = document.getElementById('return-cancel-error');
        if (!errorBox) return;

        const messageEl = errorBox.querySelector('[data-return-error-message]');
        if (messageEl) messageEl.textContent = message || '';
        errorBox.style.display = '';
    }

    clearError() {
        const errorBox = document.getElementById('return-cancel-error');
        if (!errorBox) return;

        const messageEl = errorBox.querySelector('[data-return-error-message]');
        if (messageEl) messageEl.textContent = '';
        errorBox.style.display = 'none';
    }

    // Storefront GraphQL `cancelReturn` mutation. The token is injected into the
    // page context from `settings.storefront_api.token`.
    cancelReturn(returnId) {
        return fetch('/graphql', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.context.storefrontApiToken}`,
            },
            body: JSON.stringify({
                query: `mutation CancelReturn($input: CancelOrderReturnInput!) {
                    order {
                        return {
                            cancelReturn(input: $input) {
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
                variables: { input: { returnId } },
            }),
        }).then(response => response.json());
    }

    getErrorMessages(response) {
        const transportErrors = Array.isArray(response?.errors) ? response.errors : [];
        const cancelErrors = Array.isArray(response?.data?.order?.return?.cancelReturn?.errors)
            ? response.data.order.return.cancelReturn.errors
            : [];

        return transportErrors
            .concat(cancelErrors)
            .map(error => error.message)
            .filter(Boolean);
    }
}
