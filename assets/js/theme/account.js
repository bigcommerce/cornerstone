import PageManager from './page-manager';
import _ from 'lodash';
import nod from './common/nod';
import Wishlist from './wishlist';
import validation from './common/form-validation';
import stateCountry from './common/state-country';
import { classifyForm, Validators, insertStateHiddenField, createPasswordValidationErrorTextObject } from './common/utils/form-utils';
import { createTranslationDictionary } from './common/utils/translations-utils';
import { creditCardType, storeInstrument, Validators as CCValidators, Formatters as CCFormatters } from './common/payment-method';
import swal from './global/sweet-alert';
import compareProducts from './global/compare-products';

export default class Account extends PageManager {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
        this.$state = $('[data-field-type="State"]');
        this.$body = $('body');
    }

    onReady() {
        const $editAccountForm = classifyForm('form[data-edit-account-form]');
        const $addressForm = classifyForm('form[data-address-form]');
        const $inboxForm = classifyForm('form[data-inbox-form]');
        const $accountReturnForm = classifyForm('[data-account-return-form]');
        const $paymentMethodForm = classifyForm('form[data-payment-method-form]');
        const $reorderForm = classifyForm('[data-account-reorder-form]');
        const $invoiceButton = $('[data-print-invoice]');

        compareProducts(this.context.urls);

        // Injected via template
        this.passwordRequirements = this.context.passwordRequirements;

        // Instantiates wish list JS
        Wishlist.load(this.context);

        if ($editAccountForm.length) {
            this.registerEditAccountValidation($editAccountForm);
            if (this.$state.is('input')) {
                insertStateHiddenField(this.$state);
            }
        }

        if ($invoiceButton.length) {
            $invoiceButton.on('click', () => {
                const left = window.screen.availWidth / 2 - 450;
                const top = window.screen.availHeight / 2 - 320;
                const url = $invoiceButton.data('printInvoice');

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

        if ($paymentMethodForm.length) {
            this.initPaymentMethodFormValidation($paymentMethodForm);
        }

        if ($reorderForm.length) {
            this.initReorderForm($reorderForm);
        }

        this.bindDeleteAddress();
        this.bindDeletePaymentMethod();
    }

    /**
     * Binds a submit hook to ensure the customer receives a confirmation dialog before deleting an address
     */
    bindDeleteAddress() {
        $('[data-delete-address]').on('submit', event => {
            const message = $(event.currentTarget).data('deleteAddress');

            if (!window.confirm(message)) {
                event.preventDefault();
            }
        });
    }

    bindDeletePaymentMethod() {
        $('[data-delete-payment-method]').on('submit', event => {
            const message = $(event.currentTarget).data('deletePaymentMethod');

            if (!window.confirm(message)) {
                event.preventDefault();
            }
        });
    }

    initReorderForm($reorderForm) {
        $reorderForm.on('submit', event => {
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
                swal.fire({
                    text: this.context.selectItem,
                    icon: 'error',
                });
            }
        });
    }

    initAddressFormValidation($addressForm) {
        const validationModel = validation($addressForm, this.context);
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
                    Validators.setStateCountryValidation(addressValidator, field, this.validationDictionary.field_not_blank);
                } else {
                    Validators.cleanUpStateValidation(field);
                }
            });
        }

        $addressForm.on('submit', event => {
            addressValidator.performCheck();

            if (addressValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }

    initAccountReturnFormValidation($accountReturnForm) {
        const errorMessage = $accountReturnForm.data('accountReturnFormError');

        $accountReturnForm.on('submit', event => {
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

            swal.fire({
                text: errorMessage,
                icon: 'error',
            });

            return event.preventDefault();
        });
    }

    initPaymentMethodFormValidation($paymentMethodForm) {
        // Inject validations into form fields before validation runs
        $paymentMethodForm.find('#first_name.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.firstNameLabel}", "required": true, "maxlength": 0 }`);
        $paymentMethodForm.find('#last_name.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.lastNameLabel}", "required": true, "maxlength": 0 }`);
        $paymentMethodForm.find('#company.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.companyLabel}", "required": false, "maxlength": 0 }`);
        $paymentMethodForm.find('#phone.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.phoneLabel}", "required": false, "maxlength": 0 }`);
        $paymentMethodForm.find('#address1.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.address1Label}", "required": true, "maxlength": 0 }`);
        $paymentMethodForm.find('#address2.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.address2Label}", "required": false, "maxlength": 0 }`);
        $paymentMethodForm.find('#city.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.cityLabel}", "required": true, "maxlength": 0 }`);
        $paymentMethodForm.find('#country.form-field').attr('data-validation', `{ "type": "singleselect", "label": "${this.context.countryLabel}", "required": true, prefix: "${this.context.chooseCountryLabel}" }`);
        $paymentMethodForm.find('#state.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.stateLabel}", "required": true, "maxlength": 0 }`);
        $paymentMethodForm.find('#postal_code.form-field').attr('data-validation', `{ "type": "singleline", "label": "${this.context.postalCodeLabel}", "required": true, "maxlength": 0 }`);

        const validationModel = validation($paymentMethodForm, this.context);
        const paymentMethodSelector = 'form[data-payment-method-form]';
        const paymentMethodValidator = nod({ submit: `${paymentMethodSelector} input[type="submit"]` });
        const $stateElement = $(`${paymentMethodSelector} [data-field-type="State"]`);

        let $last;
        // Requests the states for a country with AJAX
        stateCountry($stateElement, this.context, (err, field) => {
            if (err) {
                throw new Error(err);
            }

            const $field = $(field);

            if (paymentMethodValidator.getStatus($stateElement) !== 'undefined') {
                paymentMethodValidator.remove($stateElement);
            }

            if ($last) {
                paymentMethodValidator.remove($last);
            }

            if ($field.is('select')) {
                $last = field;
                Validators.setStateCountryValidation(paymentMethodValidator, field, this.validationDictionary.field_not_blank);
            } else {
                Validators.cleanUpStateValidation(field);
            }
        });

        // Use credit card number input listener to highlight credit card type
        let cardType;
        $(`${paymentMethodSelector} input[name="credit_card_number"]`).on('keyup', ({ target }) => {
            cardType = creditCardType(target.value);
            if (cardType) {
                $(`${paymentMethodSelector} img[alt="${cardType}"]`).siblings().css('opacity', '.2');
            } else {
                $(`${paymentMethodSelector} img`).css('opacity', '1');
            }
        });

        // Set of credit card validation
        CCValidators.setCreditCardNumberValidation(paymentMethodValidator, `${paymentMethodSelector} input[name="credit_card_number"]`, this.context.creditCardNumber);
        CCValidators.setExpirationValidation(paymentMethodValidator, `${paymentMethodSelector} input[name="expiration"]`, this.context.expiration);
        CCValidators.setNameOnCardValidation(paymentMethodValidator, `${paymentMethodSelector} input[name="name_on_card"]`, this.context.nameOnCard);
        CCValidators.setCvvValidation(paymentMethodValidator, `${paymentMethodSelector} input[name="cvv"]`, this.context.cvv, () => cardType);

        // Set of credit card format
        CCFormatters.setCreditCardNumberFormat(`${paymentMethodSelector} input[name="credit_card_number"]`);
        CCFormatters.setExpirationFormat(`${paymentMethodSelector} input[name="expiration"]`);

        // Billing address validation
        paymentMethodValidator.add(validationModel);

        $paymentMethodForm.on('submit', event => {
            event.preventDefault();
            // Perform final form validation
            paymentMethodValidator.performCheck();
            if (paymentMethodValidator.areAll('valid')) {
                // Serialize form data and reduce it to object
                const data = _.reduce($paymentMethodForm.serializeArray(), (obj, item) => {
                    const refObj = obj;
                    refObj[item.name] = item.value;
                    return refObj;
                }, {});

                // Assign country and state code
                const country = _.find(this.context.countries, ({ value }) => value === data.country);
                const state = country && _.find(country.states, ({ value }) => value === data.state);
                data.country_code = country ? country.code : data.country;
                data.state_or_province_code = state ? state.code : data.state;

                // Default Instrument
                data.default_instrument = !!data.default_instrument;

                // Store credit card
                storeInstrument(this.context, data, () => {
                    window.location.href = this.context.paymentMethodsUrl;
                }, () => {
                    swal.fire({
                        text: this.context.generic_error,
                        icon: 'error',
                    });
                });
            }
        });
    }

    registerEditAccountValidation($editAccountForm) {
        const validationModel = validation($editAccountForm, this.context);
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
            Validators.setEmailValidation(editValidator, emailSelector, this.validationDictionary.valid_email);
        }

        if ($passwordElement && $password2Element) {
            const { password: enterPassword, password_match: matchPassword, invalid_password: invalidPassword } = this.validationDictionary;
            editValidator.remove(passwordSelector);
            editValidator.remove(password2Selector);
            Validators.setPasswordValidation(
                editValidator,
                passwordSelector,
                password2Selector,
                this.passwordRequirements,
                createPasswordValidationErrorTextObject(enterPassword, enterPassword, matchPassword, invalidPassword),
                true,
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
                errorMessage: this.context.currentPassword,
            });
        }

        editValidator.add([
            {
                selector: `${formEditSelector} input[name='account_firstname']`,
                validate: (cb, val) => {
                    const result = val.length;

                    cb(result);
                },
                errorMessage: this.context.firstName,
            },
            {
                selector: `${formEditSelector} input[name='account_lastname']`,
                validate: (cb, val) => {
                    const result = val.length;

                    cb(result);
                },
                errorMessage: this.context.lastName,
            },
        ]);

        $editAccountForm.on('submit', event => {
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
                errorMessage: this.context.enterOrderNum,
            },
            {
                selector: 'form[data-inbox-form] input[name="message_subject"]',
                validate: (cb, val) => {
                    const result = val.length;

                    cb(result);
                },
                errorMessage: this.context.enterSubject,
            },
            {
                selector: 'form[data-inbox-form] textarea[name="message_content"]',
                validate: (cb, val) => {
                    const result = val.length;

                    cb(result);
                },
                errorMessage: this.context.enterMessage,
            },
        ]);

        $inboxForm.on('submit', event => {
            inboxValidator.performCheck();

            if (inboxValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }
}
