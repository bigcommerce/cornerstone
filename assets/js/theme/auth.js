import PageManager from '../page-manager';
import stateCountry from './common/state-country';
import $ from 'jquery';
import nod from 'casperin/nod';
import validation from './common/form-validation';
import forms from './common/models/forms';
import {classifyForm} from './common/form-utils';

export default class Auth extends PageManager {
    constructor() {
        super();
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

    registerCreateAccountValidator($createAccountForm) {
        let validationModel = validation($createAccountForm),
            createAccountValidator = nod({
                submit: '#create-account-form input[type="submit"]'
            });

        return createAccountValidator.add(validationModel);
    }

    createAccountValidation(validator, $accountForm) {
        $accountForm.submit((event) => {
            validator.performCheck();

            if (validator.areAll('valid')) {
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
        let $stateElement = $('[data-label="State/Province"]'),
            $createAccountForm = classifyForm('.create-account-form'),
            $loginForm = classifyForm('.login-form');

        nod.classes.errorClass = 'form-field--error';
        nod.classes.successClass = 'form-field--success';
        nod.classes.errorMessageClass = 'form-inlineMessage';

        if ($loginForm.length) {
            this.registerLoginValidation($loginForm);
        }

        if ($createAccountForm.length) {
            let createAccountValidator = this.registerCreateAccountValidator($createAccountForm);

            if ($stateElement) {
                stateCountry($stateElement, function (textInput, selectInput) {
                    if (selectInput) {
                        createAccountValidator.remove($stateElement);
                        createAccountValidator.add({
                            selector: selectInput,
                            validate: 'presence',
                            errorMessage: "The 'State/Province field can not be blank"
                        });
                    } else {
                        createAccountValidator.remove(textInput);
                    }
                });
            }
            this.createAccountValidation(createAccountValidator, $createAccountForm);
        }

        next();
    }
}
