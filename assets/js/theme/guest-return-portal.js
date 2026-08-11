import PageManager from './page-manager';
import NotFoundError from './not-found-error';
import nod from './common/nod';
import {
    announceInputErrorMessage,
} from './common/utils/form-utils';
import forms from './common/models/forms';

// Listed in DOM order so a failed submit can focus the first field needing correction.
const VALIDATED_FIELDS = [
    { input: '#guest-return-email-input', errorSpan: '#guest-return-email-error' },
    { input: '#guest-return-order-input', errorSpan: '#guest-return-order-error' },
];

export default class GuestReturnPortal extends PageManager {
    onReady() {
        const form = document.querySelector('[data-guest-return-portal-form]');
        if (!form) return;

        this.registerValidation();
        this.bindSubmit(form);
    }

    // Replaces stale text in the visually-hidden status region rather than appending.
    announce(message) {
        const liveRegion = document.querySelector('[data-guest-return-status]');
        if (liveRegion) liveRegion.textContent = message || '';
    }

    registerValidation() {
        this.validator = nod({
            submit: '.guest-return-portal-form button[type="submit"]',
            tap: params => {
                announceInputErrorMessage(params);
                this.syncFieldValidity(params);
            },
        });

        this.validator.add([
            {
                selector: `.guest-return-portal-form input${VALIDATED_FIELDS[0].input}`,
                validate: (cb, val) => {
                    const result = forms.email(val);

                    cb(result);
                },
                errorMessage: this.context.invalidEmail,
            },
            {
                selector: `.guest-return-portal-form input${VALIDATED_FIELDS[1].input}`,
                validate: (cb, val) => {
                    const result = forms.numbersOnly(val);

                    cb(result);
                },
                errorMessage: this.context.invalidOrder,
            },
        ]);

        // Point nod at the template's error nodes so each message keeps the stable id its
        // input references via aria-describedby. Left to itself nod appends an anonymous
        // span, which nothing can point at.
        this.validator.setMessageOptions(VALIDATED_FIELDS.map(({ input, errorSpan }) => ({
            selector: `.guest-return-portal-form input${input}`,
            errorSpan,
        })));
    }

    // Expose nod's result as ARIA state, so invalid fields aren't signalled by styling alone.
    syncFieldValidity({ element, result }) {
        if (!element) return;

        element.setAttribute('aria-invalid', String(!result));
    }

    focusFirstInvalidField() {
        VALIDATED_FIELDS
            .map(({ input }) => document.querySelector(input))
            .find(input => input && input.getAttribute('aria-invalid') === 'true')
            ?.focus();
    }

    bindSubmit(form) {
        form.addEventListener('submit', async event => {
            event.preventDefault();

            this.validator.performCheck();

            if (!this.validator.areAll('valid')) {
                this.focusFirstInvalidField();
                return;
            }

            // Ignore activations while a request is in flight
            if (this.isSubmitting) return;
            this.isSubmitting = true;
            const submitBtn = document.getElementById('return-guest-submit-btn');
            const overlay = document.querySelector('.guest-return-portal .loadingOverlay');
            // aria-disabled instead of the native attribute: disabling the button the shopper
            // just activated would drop focus to <body>, losing their place before the
            // outcome is announced. Re-entry is already blocked by `isSubmitting`.
            if (submitBtn) submitBtn.setAttribute('aria-disabled', 'true');
            if (overlay) overlay.style.display = 'block';
            form.setAttribute('aria-busy', 'true');
            this.clearError();
            this.announce(this.context.submittingMessage);
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

                // Full navigation, so the browser establishes focus in the next document.
                window.location.href = `/create-return/${payload.orderEntityId}`;
            } catch (error) {
                // Drop the in-flight message so it can't be mistaken for the current state.
                // The failure itself is announced by the role="alert" container, which leaves
                // focus on Submit for an immediate retry.
                this.announce('');

                if (error instanceof NotFoundError) {
                    this.showError(this.context.notFoundError);
                } else {
                    this.showError(this.context.genericError);
                }

                this.isSubmitting = false;
                if (submitBtn) submitBtn.removeAttribute('aria-disabled');
                if (overlay) overlay.style.display = '';
                form.removeAttribute('aria-busy');
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

    // Hiding the box between attempts also means an identical repeat error still registers
    // as a change in the alert region, so it is announced again.
    clearError() {
        const alertBox = document.querySelector('.guest-return-portal-error-container .alertBox');
        if (alertBox) alertBox.style.display = 'none';
    }
}
