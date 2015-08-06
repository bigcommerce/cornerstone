import PageManager from '../page-manager';
import _ from 'lodash';
import stateCountry from './common/state-country';
import $ from 'jquery';
import nod from './common/nod';
import validation from './common/form-validation';
import forms from './common/models/forms';
import {classifyForm, Validators} from './common/form-utils';

export default class Auth extends PageManager {
    constructor() {
        super();
        this.formCreateSelector = 'form[data-create-account-form]';
    }

    registerLoginValidation($loginForm) {
        let loginModel = forms;

        this.loginValidator = nod({
            submit: '.login-form input[type="submit"]'
        });

        this.loginValidator.add([
            {
                selector: '.login-form input[name="login_email"]',
                validate: (cb, val) => {
                    let result = loginModel.email(val);
                    cb(result);
                },
                errorMessage: "You must enter an email address"
            },
            {
                selector: '.login-form input[name="login_pass"]',
                validate: (cb, val) => {
                    let result = loginModel.password(val);
                    cb(result);
                },
                errorMessage: "You must enter a password"
            }
        ]);

        $loginForm.submit((event) => {
            this.loginValidator.performCheck();

            if (this.loginValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    registerForgotPasswordValidation($forgotPasswordForm) {
        this.forgotPasswordValidator = nod({
            submit: '.forgot-password-form input[type="submit"]'
        });

        this.forgotPasswordValidator.add([
            {
                selector: '.forgot-password-form input[name="email"]',
                validate: (cb, val) => {
                    let result = forms.email(val);
                    cb(result);
                },
                errorMessage: "You must enter an email address"
            }
        ]);

        $forgotPasswordForm.submit((event) => {
            this.forgotPasswordValidator.performCheck();

            if (this.forgotPasswordValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    registerCreateAccountValidator($createAccountForm) {
        let validationModel = validation($createAccountForm),
            createAccountValidator = nod({
                submit: `${this.formCreateSelector} input[type="submit"]`
            }),
            $stateElement = $('[data-label="State/Province"]'),
            emailSelector = `${this.formCreateSelector} [name="FormField[1][1]"]`,
            $emailElement = $(emailSelector),
            passwordSelector = `${this.formCreateSelector} [name="FormField[1][2]"]`,
            $passwordElement = $(passwordSelector),
            password2Selector = `${this.formCreateSelector} [name="FormField[1][3]"]`,
            $password2Element = $(password2Selector);

        createAccountValidator.add(validationModel);

        if ($stateElement) {
            createAccountValidator.remove($stateElement);
            let $last;

            stateCountry($stateElement, (field) => {
                let $field = $(field);

                if ($last) {
                    createAccountValidator.remove($last);
                }

                if ($field.is('select')) {
                    $last = field;
                    Validators.setStateCountryValidation(createAccountValidator, field);
                } else {
                    Validators.cleanUpStateValidation(field);
                }
            });
        }

        if ($emailElement) {
            createAccountValidator.remove(emailSelector);
            Validators.setEmailValidation(createAccountValidator, emailSelector);
        }

        if ($passwordElement && $password2Element) {
            createAccountValidator.remove(passwordSelector);
            createAccountValidator.remove(password2Selector);
            Validators.setPasswordValidation(createAccountValidator, passwordSelector, password2Selector);
        }

        $createAccountForm.submit((event) => {
            createAccountValidator.performCheck();

            if (createAccountValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    /**
     * Request is made in this function to the remote endpoint and pulls back the states for country.
     * @param next
     */
    loaded(next) {
        let $createAccountForm = classifyForm(this.formCreateSelector),
            $loginForm = classifyForm('.login-form'),
            $forgotPasswordForm = classifyForm('.forgot-password-form');

        if ($loginForm.length) {
            this.registerLoginValidation($loginForm);
        }

        if ($forgotPasswordForm.length) {
            this.registerForgotPasswordValidation($forgotPasswordForm);
        }

        if ($createAccountForm.length) {
            this.registerCreateAccountValidator($createAccountForm);
        }

        next();
    }
}
