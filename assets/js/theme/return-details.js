import PageManager from './page-manager';
import { showAlertModal } from './global/modal';

export default class ReturnDetails extends PageManager {
    onReady() {
        this.root = document.querySelector('[data-return-details]');
        if (!this.root) return;

        // The cancel action is only server-rendered for open returns.
        const cancelBtn = this.root.querySelector('[data-return-cancel]');
        if (!cancelBtn) return;

        // The return's entity ID is the `return_id` query param the page is reached with
        // (/account.php?action=view_return&return_id={id}).
        this.returnId = new URLSearchParams(window.location.search).get('return_id');

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

        this.clearError();
        const cancelBtn = this.root.querySelector('[data-return-cancel]');
        if (cancelBtn) cancelBtn.disabled = true;

        try {
            const response = await this.cancelReturn(this.returnId);
            const errorMessages = this.getCancelErrorMessages(response);

            if (errorMessages.length) {
                this.showError(errorMessages.join(' '));
                if (cancelBtn) cancelBtn.disabled = false;
                return;
            }

            // Reload so the page reflects the updated return status.
            window.location.reload();
        } catch (error) {
            this.showError(this.context.genericError);
            if (cancelBtn) cancelBtn.disabled = false;
        } finally {
            this.isCancelling = false;
        }
    }

    showError(message) {
        const errorBox = this.root.querySelector('[data-return-error]');
        if (!errorBox) return;

        errorBox.textContent = message || '';
        errorBox.style.display = '';
    }

    clearError() {
        const errorBox = this.root.querySelector('[data-return-error]');
        if (errorBox) errorBox.style.display = 'none';
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

    getCancelErrorMessages(response) {
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
