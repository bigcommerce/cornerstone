import PageManager from '../page-manager';
import nod from './common/nod';
import Wishlist from './wishlist';
import validation from './common/form-validation';
import stateCountry from './common/state-country';
import {classifyForm} from './common/form-utils';

export default class Account extends PageManager {
    constructor() {
        super();
    }

    loaded(next) {
        let $stateElement = $('[data-label="State/Province"]'),
            $editAccountForm = classifyForm('#edit-account-form'),
            $addressForm = classifyForm('#address-form');

        if ($editAccountForm.length) {
            this.registerEditAccountValidation($editAccountForm);
        }

        // Instantiates wish list JS
        new Wishlist();

        if ($addressForm.length) {
            let addressValidator = this.registerAddressValidation($addressForm);

            if ($stateElement) {
                let $last;

                stateCountry($stateElement, (field) => {
                    let $field = $(field);

                    if ($last) {
                        addressValidator.remove($last);
                    }

                    if ($field.is('select')) {
                        $last = field;
                        this.setStateCountryValidation(addressValidator, field);
                    } else {
                        this.cleanUpStateValidation(field);
                    }
                });
            }
            this.addressValidation(addressValidator, $addressForm);
        }

        next();
    }

    registerAddressValidation($addressForm) {
        let validationModel = validation($addressForm),
            addressValidator = nod({
                submit: '#address-form input[type="submit"]'
            });

        addressValidator.add(validationModel);
        return addressValidator;
    }

    addressValidation(validator, $addressForm) {
        $addressForm.submit((event) => {
            validator.performCheck();

            if (validator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    /**
     * Sets up a new validation when the form is dirty
     * @param validator
     * @param field
     */
    setStateCountryValidation(validator, field) {
        if (field) {
            validator.add({
                selector: field,
                validate: 'presence',
                errorMessage: 'The State/Province field cannot be blank'
            })
        }
    }

    /**
     * Removes classes from dirty form if previously checked
     * @param field
     */
    cleanUpStateValidation(field) {
        let $fieldClassElement = $((`div#${field.attr('id')}`));

        Object.keys(nod.classes).forEach(function (value) {
            if ($fieldClassElement.hasClass(nod.classes[value])) {
                $fieldClassElement.removeClass(nod.classes[value]);
            }
        })
    }

    registerEditAccountValidation($editAccountForm) {
        let editModel = forms.edit_account;

        this.editValidator = nod({
            submit: '.edit-account-form input[type="submit"]'
        });

        this.editValidator.add([
            {
                selector: '.edit-account-form input[name="account_firstname"]',
                validate: (cb, val) => {
                    let result = editModel.firstName(val);
                    cb(result);
                },
                errorMessage: "You must enter a first name"
            },
            {
                selector: '.edit-account-form input[name="account_lastname"]',
                validate: (cb, val) => {
                    let result = editModel.lastName(val);
                    cb(result);
                },
                errorMessage: "You must enter a last name"
            },
            {
                selector: '.edit-account-form input[data-label="Phone Number"]',
                validate: (cb, val) => {
                    let result = editModel.phone(val);
                    cb(result);
                },
                errorMessage: "You must enter a Phone Number"
            },
            {
                selector: '.create-account-form input[data-label="Email Address"]',
                validate: (cb, val) => {
                    let result = registerModel.email(val);
                    cb(result);
                },
                errorMessage: "You must enter a valid email address"
            },
            {
                selector: '.edit-account-form input[data-label="Password"]',
                validate: (cb, val) => {
                    let result = editModel.password(val);

                    //if no password at all, they are not changing it
                    if (val === '') {
                        result = true;
                    }

                    cb(result);
                },
                errorMessage: "Your new password must be at least 7 characters with letters AND numbers"
            },
            {
                selector: '.edit-account-form input[data-label="Confirm Password"]',
                triggeredBy: '.edit-account-form input[data-label="Password"]',
                validate: (cb, val) => {
                    let password1 = $('.edit-account-form input[data-label="Password"]').val(),
                        result = editModel.passwordMatch(val, password1)
                            && editModel.password(val);
                    if (password1 === '') {
                        result = true;
                    }

                    cb(result);
                },
                errorMessage: "Your passwords do not match"
            },
            {
                selector: '.edit-account-form input[data-label="Current Password"]',
                validate: (cb, val) => {
                    let password1 = $('.edit-account-form input[data-label="Password"]').val(),
                        result = val.length;

                    if (password1 === '') {
                        result = true;
                    }

                    cb(result);
                },
                errorMessage: "You must enter your current password when changing passwords"
            }
        ]);

        $editAccountForm.submit((event) => {
            this.editValidator.performCheck();

            if (this.editValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }
}
