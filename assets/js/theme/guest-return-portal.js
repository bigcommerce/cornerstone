import PageManager from './page-manager';
import NotFoundError from './not-found-error';
import nod from './common/nod';
import {
    announceInputErrorMessage,
} from './common/utils/form-utils';
import forms from './common/models/forms';

// Keep in DOM order — a failed submit focuses the first invalid field.
// Both nod and the submit handler use the same `isValid` to check a field.
const VALIDATED_FIELDS = [
    { input: '#guest-return-email-input', errorSpan: '#guest-return-email-error', isValid: val => forms.email(val) },
    { input: '#guest-return-order-input', errorSpan: '#guest-return-order-error', isValid: val => forms.numbersOnly(val) },
];

export default class GuestReturnPortal extends PageManager {
    onReady() {
        const form = document.querySelector('[data-guest-return-portal-form]');
        if (!form) return;

        this.registerValidation();
        this.bindSubmit(form);
    }

    // Replaces the message in the hidden status region that screen readers read out.
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
                validate: (cb, val) => cb(VALIDATED_FIELDS[0].isValid(val)),
                errorMessage: this.context.invalidEmail,
            },
            {
                selector: `.guest-return-portal-form input${VALIDATED_FIELDS[1].input}`,
                validate: (cb, val) => cb(VALIDATED_FIELDS[1].isValid(val)),
                errorMessage: this.context.invalidOrder,
            },
        ]);

        // Have nod write errors into the template's own spans — their ids are what
        // each input's aria-describedby points at.
        this.validator.setMessageOptions(VALIDATED_FIELDS.map(({ input, errorSpan }) => ({
            selector: `.guest-return-portal-form input${input}`,
            errorSpan,
        })));
    }

    // Mirror nod's result onto aria-invalid so screen readers know the field's state.
    syncFieldValidity({ element, result }) {
        if (!element) return;

        element.setAttribute('aria-invalid', String(!result));
    }

    findFirstInvalidField() {
        return VALIDATED_FIELDS
            .map(({ input, isValid }) => ({ element: document.querySelector(input), isValid }))
            .find(({ element, isValid }) => element && !isValid(element.value))
            ?.element;
    }

    // Empty the inline errors before each attempt, so a resubmit doesn't
    // announce the same message twice.
    resetInlineErrors() {
        VALIDATED_FIELDS.forEach(({ errorSpan }) => {
            const span = document.querySelector(errorSpan);
            if (!span) return;

            span.textContent = '';
            span.style.display = 'none';
        });
    }

    bindSubmit(form) {
        form.addEventListener('submit', async event => {
            event.preventDefault();

            // Start each attempt clean — errors from the last attempt no longer apply.
            this.resetInlineErrors();
            this.clearError();

            const firstInvalidField = this.findFirstInvalidField();
            if (firstInvalidField) {
                // Focus the field first, then render the errors — this way the shopper
                // hears the field, then its error, exactly once each.
                firstInvalidField.focus();
                this.validator.performCheck();
                return;
            }

            this.validator.performCheck();
            if (!this.validator.areAll('valid')) return;

            // Ignore activations while a request is in flight
            if (this.isSubmitting) return;
            this.isSubmitting = true;
            const submitBtn = document.getElementById('return-guest-submit-btn');
            const overlay = document.querySelector('.guest-return-portal .loadingOverlay');
            // aria-disabled keeps focus on the button; the native `disabled` would drop
            // focus to the page. Repeat submits are already blocked by `isSubmitting`.
            if (submitBtn) submitBtn.setAttribute('aria-disabled', 'true');
            if (overlay) overlay.style.display = 'block';
            form.setAttribute('aria-busy', 'true');
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

                // Full page navigation — the browser handles focus on the next page.
                window.location.href = `/create-return/${payload.orderEntityId}`;
            } catch (error) {
                // Clear the "please wait" message; the error box announces the failure
                // while focus stays on the button so the shopper can retry right away.
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
        if (messageElement) messageElement.textContent = message || '';

        alertBox.style.display = 'block';
    }

    // Hide the box between attempts so even a repeat of the same error
    // counts as new content and is announced again.
    clearError() {
        const alertBox = document.querySelector('.guest-return-portal-error-container .alertBox');
        if (alertBox) alertBox.style.display = 'none';
    }
}
