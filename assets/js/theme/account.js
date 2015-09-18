import PageManager from '../page-manager';
import nod from './common/nod';
import Wishlist from './wishlist';
import validation from './common/form-validation';
import stateCountry from './common/state-country';
import {classifyForm, Validators, insertStateHiddenField} from './common/form-utils';

export default class Account extends PageManager {
    constructor() {
        super();
        this.$state = $('[data-field-type="State"]');
        this.$body = $('body');
    }

    loaded(next) {
        let $editAccountForm = classifyForm('form[data-edit-account-form'),
            $addressForm = classifyForm('form[data-address-form]'),
            $inboxForm = classifyForm('form[data-inbox-form]'),
            $accountReturnForm = classifyForm('[data-account-return-form]'),
            $reorderForm = classifyForm('[data-account-reorder-form]');

        // Injected via template
        this.passwordRequirements = this.context.passwordRequirements;

        // Instantiates wish list JS
        this.wishlist = new Wishlist();

        if ($editAccountForm.length) {
            this.registerEditAccountValidation($editAccountForm);
            if (this.$state.is('input')) {
                insertStateHiddenField(this.$state);
            }
        }

        if ($addressForm.length) {
            this.initAddressFormValidation($addressForm);
            if (this.$state.is('input')) {
                insertStateHiddenField(this.$state);
            }
        }

        if ($inboxForm.length) {
            this.registerInboxValidation($inboxForm);
        }

        if ($accountReturnForm.length) {
            this.initAccountReturnFormValidation($accountReturnForm);
        }

        if ($reorderForm.length) {
            this.initReorderForm($reorderForm);
        }

        this.bindCheckboxFields();
        this.bindDeleteAddress();

        next();
    }

    /**
     * Binds all checkboxes in the orders list to a change event so it can
     * fire an event for other handlers to listen to
     */
    bindCheckboxFields() {
        $('.account-listItem .form-checkbox').on('change', (event) => {
            let $ele = $(event.currentTarget),
                id = $ele.val(),
                eleVal = '';

            if ($ele.is(':checked')) {
                eleVal = 'on';
            }

            this.$body.trigger('orderCheckboxChanged', [id, eleVal]);
        });
    }

    /**
     * Binds a submit hook to ensure the customer receives a confirmation dialog before deleting an address
     */
    bindDeleteAddress() {
        $('[data-delete-address]').on('submit', (event) => {
            let message = $(event.currentTarget).data('delete-address');

            if (!confirm(message)) {
                event.preventDefault();
            }
        });
    }

    initReorderForm($reorderForm) {
        // Update hidden form values accordingly
        this.$body.on('orderCheckboxChanged', (event, id, eleVal) => {
            $reorderForm.find('[name="reorderitem\[' + id + '\]"]').val(eleVal);
        });

        $reorderForm.on('submit', (event) => {
            let $reorderItems = $reorderForm.find('[name^="reorderitem"]'),
                submitForm = false;

            // If one item has a value, submit the form.
            $reorderItems.each((i, ele) => {
                if ($(ele).val()) {
                    submitForm = true;
                    return true;
                }
            });

            if (!submitForm) {
                event.preventDefault();
                alert('Please select one or more items to reorder.');
            }
        });
    }

    initAddressFormValidation($addressForm) {
        let validationModel = validation($addressForm),
            stateSelector = 'form[data-address-form] [data-field-type="State"]',
            $stateElement = $(stateSelector),
            addressValidator = nod({
                submit: 'form[data-address-form] input[type="submit"]'
            });

        addressValidator.add(validationModel);

        if ($stateElement) {
            let $last;

            // Requests the states for a country with AJAX
            stateCountry($stateElement, this.context, (err, field) => {
                if (err) {
                    throw new Error(err);
                }

                let $field = $(field);

                if (addressValidator.getStatus($stateElement) !== 'undefined') {
                    addressValidator.remove($stateElement);
                }

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
                if ($(ele).val() !== 0) {
                    formSubmit = true;

                    // Exit out of loop if we found at least one return
                    return true;
                }
            });

            if (formSubmit) {
                return true;
            }

            alert('Please select one or more items to return');

            return false;
        });
    }

    registerEditAccountValidation($editAccountForm) {
        let validationModel = validation($editAccountForm),
            formEditSelector = 'form[data-edit-account-form]',
            editValidator = nod({
                submit: '${formEditSelector} input[type="submit"]'
            }),
            emailSelector = `${formEditSelector} [data-field-type="EmailAddress"]`,
            $emailElement = $(emailSelector),
            passwordSelector = `${formEditSelector} [data-field-type="Password"]`,
            $passwordElement = $(passwordSelector),
            password2Selector = `${formEditSelector} [data-field-type="ConfirmPassword"]`,
            $password2Element = $(password2Selector),
            currentPasswordSelector = `${formEditSelector} [data-field-type="CurrentPassword"]`,
            $currentPassword = $(currentPasswordSelector);

        // This only handles the custom fields, standard fields are added below
        editValidator.add(validationModel);

        if ($emailElement) {
            editValidator.remove(emailSelector);
            Validators.setEmailValidation(editValidator, emailSelector);
        }

        if ($passwordElement && $password2Element) {
            editValidator.remove(passwordSelector);
            editValidator.remove(password2Selector);
            Validators.setPasswordValidation(
                editValidator,
                passwordSelector,
                password2Selector,
                this.passwordRequirements,
                true
            );
        }

        if ($currentPassword) {
            editValidator.add({
                selector: currentPasswordSelector,
                validate: (cb, val) => {
                    let result = true;

                    if (val === '' && $passwordElement.val() !== '') {
                        result = false;
                    }

                    cb(result);
                },
                errorMessage: 'You must enter your current password.'
            });
        }

        editValidator.add([
            {
                selector: `${formEditSelector} input[name='account_firstname']`,
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: 'You must enter a first name.'
            },
            {
                selector: `${formEditSelector} input[name='account_lastname']`,
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: 'You must enter a last name.'
            },
            {
                selector: `${formEditSelector} input[name='account_phone']`,
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: 'You must enter a phone number.'
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
                errorMessage: 'You must select an order.'
            },
            {
                selector: 'form[data-inbox-form] input[name="message_subject"]',
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: 'You must enter a subject.'
            },
            {
                selector: 'form[data-inbox-form] textarea[name="message_content"]',
                validate: (cb, val) => {
                    let result = val.length;
                    cb(result);
                },
                errorMessage: 'You must enter a message.'
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
