import PageManager from './page-manager';
import stateCountry from './common/state-country';
import nod from './common/nod';
import validation from './common/form-validation';
import forms from './common/models/forms';
import {
    classifyForm,
    Validators,
    createPasswordValidationErrorTextObject,
    announceInputErrorMessage,
} from './common/utils/form-utils';
import { createTranslationDictionary } from './common/utils/translations-utils';

export default class Auth extends PageManager {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
        this.formCreateSelector = 'form[data-create-account-form]';
        this.recaptcha = $('.g-recaptcha iframe[src]');
    }

    registerLoginValidation($loginForm) {
        const loginModel = forms;

        this.loginValidator = nod({
            submit: '.login-form input[type="submit"]',
            tap: announceInputErrorMessage,
        });

        this.loginValidator.add([
            {
                selector: '.login-form input[name="login_email"]',
                validate: (cb, val) => {
                    const result = loginModel.email(val);

                    cb(result);
                },
                errorMessage: this.context.useValidEmail,
            },
            {
                selector: '.login-form input[name="login_pass"]',
                validate: (cb, val) => {
                    const result = loginModel.password(val);

                    cb(result);
                },
                errorMessage: this.context.enterPass,
            },
        ]);

        $loginForm.on('submit', event => {
            this.loginValidator.performCheck();

            if (this.loginValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    registerForgotPasswordValidation($forgotPasswordForm) {
        this.forgotPasswordValidator = nod({
            submit: '.forgot-password-form input[type="submit"]',
            tap: announceInputErrorMessage,
        });

        this.forgotPasswordValidator.add([
            {
                selector: '.forgot-password-form input[name="email"]',
                validate: (cb, val) => {
                    const result = forms.email(val);

                    cb(result);
                },
                errorMessage: this.context.useValidEmail,
            },
        ]);

        $forgotPasswordForm.on('submit', event => {
            this.forgotPasswordValidator.performCheck();

            if (this.forgotPasswordValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    registerNewPasswordValidation() {
        const { password: enterPassword, password_match: matchPassword } = this.validationDictionary;
        const newPasswordForm = '.new-password-form';
        const newPasswordValidator = nod({
            submit: $(`${newPasswordForm} input[type="submit"]`),
            tap: announceInputErrorMessage,
        });
        const passwordSelector = $(`${newPasswordForm} input[name="password"]`);
        const password2Selector = $(`${newPasswordForm} input[name="password_confirm"]`);
        const errorTextMessages = createPasswordValidationErrorTextObject(enterPassword, enterPassword, matchPassword, this.passwordRequirements.error);
        Validators.setPasswordValidation(
            newPasswordValidator,
            passwordSelector,
            password2Selector,
            this.passwordRequirements,
            errorTextMessages,
        );
    }

    registerCreateAccountValidator($createAccountForm) {
        const validationModel = validation($createAccountForm, this.context);
        const createAccountValidator = nod({
            submit: `${this.formCreateSelector} input[type='submit']`,
            delay: 900,
        });
        const $stateElement = $('[data-field-type="State"]');
        const emailSelector = `${this.formCreateSelector} [data-field-type='EmailAddress']`;
        const $emailElement = $(emailSelector);
        const passwordSelector = `${this.formCreateSelector} [data-field-type='Password']`;
        const $passwordElement = $(passwordSelector);
        const password2Selector = `${this.formCreateSelector} [data-field-type='ConfirmPassword']`;
        const $password2Element = $(password2Selector);

        createAccountValidator.add(validationModel);

        if ($stateElement) {
            let $last;

            // Requests the states for a country with AJAX
            stateCountry($stateElement, this.context, (err, field) => {
                if (err) {
                    throw new Error(err);
                }

                const $field = $(field);

                if (createAccountValidator.getStatus($stateElement) !== 'undefined') {
                    createAccountValidator.remove($stateElement);
                }

                if ($last) {
                    createAccountValidator.remove($last);
                }

                if ($field.is('select')) {
                    $last = field;
                    Validators.setStateCountryValidation(createAccountValidator, field, this.validationDictionary.field_not_blank);
                } else {
                    Validators.cleanUpStateValidation(field);
                }
            });
        }

        if ($emailElement) {
            createAccountValidator.remove(emailSelector);
            Validators.setEmailValidation(createAccountValidator, emailSelector, this.validationDictionary.valid_email);
        }

        if ($passwordElement && $password2Element) {
            const { password: enterPassword, password_match: matchPassword } = this.validationDictionary;

            createAccountValidator.remove(passwordSelector);
            createAccountValidator.remove(password2Selector);
            Validators.setPasswordValidation(
                createAccountValidator,
                passwordSelector,
                password2Selector,
                this.passwordRequirements,
                createPasswordValidationErrorTextObject(enterPassword, enterPassword, matchPassword, this.passwordRequirements.error),
            );
        }

        $createAccountForm.on('submit', (event) => {
            this.submitAction(event, createAccountValidator);
        });
    }

    submitAction(event, validator) {
        validator.performCheck();

        if (validator.areAll('valid')) {
            return;
        }
        event.preventDefault();
        setTimeout(() => {
            const earliestError = $('span.form-inlineMessage:first').prev('input');
            earliestError.focus();
        }, 900);
    }

    /**
     * Request is made in this function to the remote endpoint and pulls back the states for country.
     */
    onReady() {
        if (!this.recaptcha.attr('title')) {
            this.recaptcha.attr('title', this.context.recaptchaTitle);
        }

        const $createAccountForm = classifyForm(this.formCreateSelector);
        const $loginForm = classifyForm('.login-form');
        const $forgotPasswordForm = classifyForm('.forgot-password-form');
        const $newPasswordForm = classifyForm('.new-password-form'); // reset password

        // Injected via auth.html
        this.passwordRequirements = this.context.passwordRequirements;

        if ($loginForm.length) {
            this.registerLoginValidation($loginForm);
        }

        if ($newPasswordForm.length) {
            this.registerNewPasswordValidation();
        }

        if ($forgotPasswordForm.length) {
            this.registerForgotPasswordValidation($forgotPasswordForm);
        }

        if ($createAccountForm.length) {
            this.registerCreateAccountValidator($createAccountForm);
        }
    }
}
