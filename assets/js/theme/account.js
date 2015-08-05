import PageManager from '../page-manager';
import nod from './common/nod';
import Wishlist from './wishlist';
import validation from './common/form-validation';
import stateCountry from './common/state-country';
import forms from './common/models/forms';
import {classifyForm, Validators} from './common/form-utils';

export default class Account extends PageManager {
    constructor() {
        super();
    }

    loaded(next) {
        let $editAccountForm = classifyForm('form[data-edit-account-form'),
            $addressForm = classifyForm('form[data-address-form]'),
            $inboxForm = classifyForm('form[data-inbox-form]'),
            $accountReturnForm = classifyForm('[data-account-return-form]');

        // Instantiates wish list JS
        new Wishlist();

        if ($editAccountForm.length) {
            this.registerEditAccountValidation($editAccountForm);
        }

        if ($addressForm.length) {
            this.initAddressFormValidation($addressForm);
        }

        if ($inboxForm.length) {
            this.registerInboxValidation($inboxForm);
        }

        if ($accountReturnForm.length) {
            this.initAccountReturnFormValidation($accountReturnForm);
        }

        next();
    }

    initAddressFormValidation($addressForm) {
        let validationModel = validation($addressForm),
            stateSelector = 'form[data-address-form] [name="FormField[2][12]"]',
            $stateElement = $(stateSelector),
            addressValidator = nod({
                submit: 'form[data-address-form] input[type="submit"]'
            });

        addressValidator.add(validationModel);

        if ($stateElement) {
            let $last;

            stateCountry($stateElement, (field) => {
                let $field = $(field);

                if ($last) {
                    addressValidator.remove($last);
                }

                if ($field.is('select')) {
                    $last = field;
                    Validators.setStateCountryValidation(addressValidator, field);
                } else {
                    Validators.cleanUpStateValidation(field);
                }
            });
        }

        $addressForm.submit((event) => {
            addressValidator.performCheck();

            if (addressValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    initAccountReturnFormValidation($accountReturnForm) {
        $accountReturnForm.submit(() => {
            let formSubmit = false;

            // Iterate until we find a non-zero value in the dropdown for quantity
            $('[name^="return_qty"]', $accountReturnForm).each((i, ele) => {
                if ($(ele).val() != 0) {
                    formSubmit = true;

                    // Exit out of loop if we found at least one return
                    return true;
                }
            });

            if (formSubmit) {
                return true;
            } else {
                alert('Please select one or more items to return');
                return false;
            }
        })
    }

    registerEditAccountValidation($editAccountForm) {
        let validationModel = validation($editAccountForm),
            editValidator = nod({
                submit: 'form[data-edit-account-form] input[type="submit"]'
            }),
            emailSelector = 'form[data-edit-account-form] [name="FormField[1][1]"]',
            $emailElement = $(emailSelector);

        //This only handles the custom fields, standard fields are added below
        editValidator.add(validationModel);

        if ($emailElement) {
            editValidator.remove(emailSelector);
            Validators.setEmailValidation(editValidator, emailSelector);
        }

        editValidator.add([
            {
                selector: 'form[data-edit-account-form] input[name="account_firstname"]',
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: "You must enter a first name"
            },
            {
                selector: 'form[data-edit-account-form] input[name="account_lastname"]',
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: "You must enter a last name"
            },
            {
                selector: 'form[data-edit-account-form] input[name="account_phone"]',
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: "You must enter a Phone Number"
            }
        ]);


        $editAccountForm.submit((event) => {
            editValidator.performCheck();

            if (editValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    registerInboxValidation($inboxForm) {

        let inboxValidator = nod({
            submit: 'form[data-inbox-form] input[type="submit"]'
        });

        inboxValidator.add([
            {
                selector: 'form[data-inbox-form] select[name="message_order_id"]',
                validate: (cb, val) => {
                    let result = Number(val) !== 0;
                    cb(result);
                },
                errorMessage: "You must select an order"
            },
            {
                selector: 'form[data-inbox-form] input[name="message_subject"]',
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: "You must enter a subject"
            },
            {
                selector: 'form[data-inbox-form] textarea[name="message_content"]',
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: "You must enter a message"
            }
        ]);

        $inboxForm.submit((event) => {
            inboxValidator.performCheck();

            if (inboxValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }
}
