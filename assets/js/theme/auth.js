import PageManager from '../page-manager';
import stateCountry from './common/state-country';
import $ from 'jquery';
import nod from 'casperin/nod';
import { forms } from 'bigcommerce/stencil-utils';

export default class Auth extends PageManager {
    constructor() {
        super();
    }

    registerLoginValidation($loginForm) {
        let loginModel = forms.login;

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

    registerCreateAccountValidation($createAccountForm) {
        let registerModel = forms.create_account;

        this.registerValidator = nod({
            submit: '.create-account-form input[type="submit"]'
        });

        this.registerValidator.add([
            {
                selector: '.create-account-form input[data-label="Email Address"]',
                validate: (cb, val) => {
                    let result = registerModel.email(val);
                    cb(result);
                },
                errorMessage: "You must enter a valid email address"
            },
            {
                selector: '.create-account-form input[data-label="Password"]',
                validate: (cb, val) => {
                    let result = registerModel.password(val);
                    cb(result);
                },
                errorMessage: "Your password must be at least 7 characters with letters AND numbers"
            },
            {
                selector: '.create-account-form input[data-label="Confirm Password"]',
                triggeredBy: '.create-account-form input[data-label="Password"]',
                validate: (cb, val) => {
                    let password1 = $('.create-account-form input[data-label="Password"]').val();
                    let result = registerModel.passwordMatch(val, password1)
                        && registerModel.password(val);
                    cb(result);
                },
                errorMessage: "Your passwords do not match"
            },
            {
                selector: '.create-account-form input[data-label="First Name"]',
                validate: (cb, val) => {
                    let result = registerModel.firstName(val);
                    cb(result);
                },
                errorMessage: "You must enter a First Name"
            },
            {
                selector: '.create-account-form input[data-label="Last Name"]',
                validate: (cb, val) => {
                    let result = registerModel.lastName(val);
                    cb(result);
                },
                errorMessage: "You must enter a Last Name"
            },
            {
                selector: '.create-account-form input[data-label="Phone Number"]',
                validate: (cb, val) => {
                    let result = registerModel.phone(val);
                    cb(result);
                },
                errorMessage: "You must enter a Phone Number"
            },
            {
                selector: '.create-account-form input[data-label="Address Line 1"]',
                validate: (cb, val) => {
                    let result = registerModel.address1(val);
                    cb(result);
                },
                errorMessage: "You must enter an address"
            },
            {
                selector: '.create-account-form input[data-label="Suburb/City"]',
                validate: (cb, val) => {
                    let result = registerModel.city(val);
                    cb(result);
                },
                errorMessage: "You must enter a Suburb or City"
            },
            {
                selector: '.create-account-form select[data-label="Country"]',
                validate: (cb, val) => {
                    let result = registerModel.country(val);
                    cb(result);
                },
                errorMessage: "You must enter a Country"
            },
            {
                selector: '.create-account-form input[data-label="Zip/Postcode]',
                validate: (cb, val) => {
                    let result = registerModel.postcode(val);
                    cb(result);
                },
                errorMessage: "You must enter a Zip or Postcode"
            }
        ]);

        $createAccountForm.submit((event) => {
            this.registerValidator.performCheck();

            if (this.registerValidator.areAll('valid')) {
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
            $createAccountForm = $('.create-account-form'),
            $loginForm = $('.login-form');

        if ($stateElement){
            stateCountry($stateElement);
        }

        nod.classes.errorClass = 'form-field--error';
        nod.classes.successClass = 'form-field--success';
        nod.classes.errorMessageClass = 'form-inlineMessage';

        if ($loginForm.length) {
            this.registerLoginValidation($loginForm);
        }

        if ($createAccountForm.length) {
            this.registerCreateAccountValidation($createAccountForm);
        }

        next();
    }
}
