import PageManager from './page-manager';
import NotFoundError from './not-found-error';

export default class GuestReturnPortal extends PageManager {
    onReady() {
        const form = document.querySelector('[data-guest-return-portal-form]');
        if (!form) return;

        this.bindSubmit(form);
    }

    bindSubmit(form) {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            // Ignore clicks while a request is in flight
            if (this.isSubmitting) return;
            this.isSubmitting = true;
            const submitBtn = document.getElementById('return-guest-submit-btn');
            const overlay = document.querySelector('.guest-return-portal .loadingOverlay');
            if (submitBtn) submitBtn.disabled = true;
            if (overlay) overlay.style.display = 'block';
            const payload = this.buildRequestPayload();

            try {
                const response = await this.startReturnGuestSession(payload);
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                if (responseData?.errors?.length > 0) {
                    throw new Error('Failed to start return guest session');
                }

                if (responseData?.data?.order?.return?.startReturnGuestSession?.errors?.length > 0) {
                    for (const error of responseData.data.order.return.startReturnGuestSession.errors) {
                        if (error.__typename === 'NotFoundError') {
                            throw new NotFoundError(error.message);
                        }
                    }
                    throw new Error('Failed to start return guest session');
                }

                window.location.href = `/create-return/${payload.orderEntityId}`;
            } catch (error) {
                if (error instanceof NotFoundError) {
                    this.showError(this.context.notFoundError);
                } else {
                    this.showError(this.context.genericError);
                }

                this.isSubmitting = false;
                if (submitBtn) submitBtn.disabled = false;
                if (overlay) overlay.style.display = '';
            }
        });
    }

    buildRequestPayload() {
        return {
            email: document.getElementById('guest-return-email-input')?.value,
            orderEntityId: parseInt(document.getElementById('guest-return-order-input')?.value, 10),
        };
    }

    startReturnGuestSession(input) {
        return fetch('/graphql', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.context.storefrontApiToken}`,
            },
            body: JSON.stringify({
                query: `mutation StartReturnGuestSession($input: StartReturnGuestSessionInput!) {
                    order {
                        return {
                            startReturnGuestSession(input: $input) {
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
        });
    }

    showError(message) {
        const alertBox = document.querySelector('.guest-return-portal-error-container .alertBox');
        if (!alertBox) return;

        const messageElement = alertBox.querySelector('#alertBox-message-text');

        alertBox.style.display = 'block';
        if (messageElement) messageElement.textContent = message || '';
    }
}
