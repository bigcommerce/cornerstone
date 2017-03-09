import PageManager from './page-manager';
import $ from 'jquery';
import nod from './common/nod';
import Wishlist from './wishlist';
import validation from './common/form-validation';
import stateCountry from './common/state-country';
import { classifyForm, Validators, insertStateHiddenField } from './common/form-utils';

export default class Account extends PageManager {
    constructor() {
        super();

        this.$state = $('[data-field-type="State"]');
        this.$body = $('body');
    }

    loaded(next) {
        const $editAccountForm = classifyForm('form[data-edit-account-form]');
        const $addressForm = classifyForm('form[data-address-form]');
        const $inboxForm = classifyForm('form[data-inbox-form]');
        const $accountReturnForm = classifyForm('[data-account-return-form]');
        const $reorderForm = classifyForm('[data-account-reorder-form]');
        const $invoiceButton = $('[data-print-invoice]');

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

        if ($invoiceButton.length) {
            $invoiceButton.on('click', () => {
                const left = screen.availWidth / 2 - 450;
                const top = screen.availHeight / 2 - 320;
                const url = $invoiceButton.data('print-invoice');

                window.open(url, 'orderInvoice', `width=900,height=650,left=${left},top=${top},scrollbars=1`);
            });
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

        this.bindDeleteAddress();

        next();
    }

    /**
     * Binds a submit hook to ensure the customer receives a confirmation dialog before deleting an address
     */
    bindDeleteAddress() {
        $('[data-delete-address]').on('submit', (event) => {
            const message = $(event.currentTarget).data('delete-address');

            if (!confirm(message)) {
                event.preventDefault();
            }
        });
    }

    initReorderForm($reorderForm) {
        $reorderForm.on('submit', (event) => {
            const $productReorderCheckboxes = $('.account-listItem .form-checkbox:checked');
            let submitForm = false;

            $reorderForm.find('[name^="reorderitem"]').remove();

            $productReorderCheckboxes.each((index, productCheckbox) => {
                const productId = $(productCheckbox).val();
                const $input = $('<input>', {
                    type: 'hidden',
                    name: `reorderitem[${productId}]`,
                    value: '1',
                });

                submitForm = true;

                $reorderForm.append($input);
            });

            if (!submitForm) {
                event.preventDefault();
                alert('Please select one or more items to reorder.');
            }
        });
    }

    initAddressFormValidation($addressForm) {
        const validationModel = validation($addressForm);
        const stateSelector = 'form[data-address-form] [data-field-type="State"]';
        const $stateElement = $(stateSelector);
        const addressValidator = nod({
            submit: 'form[data-address-form] input[type="submit"]',
        });

        addressValidator.add(validationModel);

        if ($stateElement) {
            let $last;

            // Requests the states for a country with AJAX
            stateCountry($stateElement, this.context, (err, field) => {
                if (err) {
                    throw new Error(err);
                }

                const $field = $(field);

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
        const errorMessage = $accountReturnForm.data('account-return-form-error');

        $accountReturnForm.submit((event) => {
            let formSubmit = false;

            // Iterate until we find a non-zero value in the dropdown for quantity
            $('[name^="return_qty"]', $accountReturnForm).each((i, ele) => {
                if (parseInt($(ele).val(), 10) !== 0) {
                    formSubmit = true;

                    // Exit out of loop if we found at least one return
                    return true;
                }
            });

            if (formSubmit) {
                return true;
            }

            alert(errorMessage);

            return event.preventDefault();
        });
    }

    registerEditAccountValidation($editAccountForm) {
        const validationModel = validation($editAccountForm);
        const formEditSelector = 'form[data-edit-account-form]';
        const editValidator = nod({
            submit: '${formEditSelector} input[type="submit"]',
        });
        const emailSelector = `${formEditSelector} [data-field-type="EmailAddress"]`;
        const $emailElement = $(emailSelector);
        const passwordSelector = `${formEditSelector} [data-field-type="Password"]`;
        const $passwordElement = $(passwordSelector);
        const password2Selector = `${formEditSelector} [data-field-type="ConfirmPassword"]`;
        const $password2Element = $(password2Selector);
        const currentPasswordSelector = `${formEditSelector} [data-field-type="CurrentPassword"]`;
        const $currentPassword = $(currentPasswordSelector);

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
                errorMessage: 'You must enter your current password.',
            });
        }

        editValidator.add([
            {
                selector: `${formEditSelector} input[name='account_firstname']`,
                validate: (cb, val) => {
                    const result = val.length;

                    cb(result);
                },
                errorMessage: 'You must enter a first name.',
            },
            {
                selector: `${formEditSelector} input[name='account_lastname']`,
                validate: (cb, val) => {
                    const result = val.length;

                    cb(result);
                },
                errorMessage: 'You must enter a last name.',
            },
            {
                selector: `${formEditSelector} input[name='account_phone']`,
                validate: (cb, val) => {
                    const result = val.length;

                    cb(result);
                },
                errorMessage: 'You must enter a phone number.',
            },
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
        const inboxValidator = nod({
            submit: 'form[data-inbox-form] input[type="submit"]',
        });

        inboxValidator.add([
            {
                selector: 'form[data-inbox-form] select[name="message_order_id"]',
                validate: (cb, val) => {
                    const result = Number(val) !== 0;

                    cb(result);
                },
                errorMessage: 'You must select an order.',
            },
            {
                selector: 'form[data-inbox-form] input[name="message_subject"]',
                validate: (cb, val) => {
                    const result = val.length;

                    cb(result);
                },
                errorMessage: 'You must enter a subject.',
            },
            {
                selector: 'form[data-inbox-form] textarea[name="message_content"]',
                validate: (cb, val) => {
                    const result = val.length;

                    cb(result);
                },
                errorMessage: 'You must enter a message.',
            },
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
