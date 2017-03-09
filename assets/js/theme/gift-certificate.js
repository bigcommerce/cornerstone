import PageManager from './page-manager';
import $ from 'jquery';
import nod from './common/nod';
import giftCertChecker from './common/gift-certificate-validator';
import formModel from './common/models/forms';
import { api } from '@bigcommerce/stencil-utils';
import { defaultModal } from './global/modal';

export default class GiftCertificate extends PageManager {
    constructor() {
        super();

        const $certBalanceForm = $('#gift-certificate-balance');

        const purchaseModel = {
            recipientName(val) {
                return val.length;
            },
            recipientEmail(...args) {
                return formModel.email(...args);
            },
            senderName(val) {
                return val.length;
            },
            senderEmail(...args) {
                return formModel.email(...args);
            },
            customAmount(value, min, max) {
                return value && value >= min && value <= max;
            },
            setAmount(value, options) {
                let found = false;

                options.forEach((option) => {
                    if (option === value) {
                        found = true;
                        return false;
                    }
                });

                return found;
            },
        };

        const $purchaseForm = $('#gift-certificate-form');
        const $customAmounts = $purchaseForm.find('input[name="certificate_amount"]');
        const purchaseValidator = nod({
            submit: '#gift-certificate-form input[type="submit"]',
            delay: 300,
        });

        if ($customAmounts.length) {
            const $element = $purchaseForm.find('input[name="certificate_amount"]');
            const min = $element.data('min');
            const minFormatted = $element.data('min-formatted');
            const max = $element.data('max');
            const maxFormatted = $element.data('max-formatted');

            purchaseValidator.add({
                selector: '#gift-certificate-form input[name="certificate_amount"]',
                validate: (cb, val) => {
                    const numberVal = Number(val);

                    if (!numberVal) {
                        cb(false);
                    }

                    cb(numberVal >= min && numberVal <= max);
                },
                errorMessage: `You must enter a certificate amount between ${minFormatted} and ${maxFormatted}.`,
            });
        }

        purchaseValidator.add([
            {
                selector: '#gift-certificate-form input[name="to_name"]',
                validate: (cb, val) => {
                    const result = purchaseModel.recipientName(val);

                    cb(result);
                },
                errorMessage: 'You must enter a valid recipient name.',
            },
            {
                selector: '#gift-certificate-form input[name="to_email"]',
                validate: (cb, val) => {
                    const result = purchaseModel.recipientEmail(val);

                    cb(result);
                },
                errorMessage: 'You must enter a valid recipient email.',
            },
            {
                selector: '#gift-certificate-form input[name="from_name"]',
                validate: (cb, val) => {
                    const result = purchaseModel.senderName(val);

                    cb(result);
                },
                errorMessage: 'You must enter your name.',
            },
            {
                selector: '#gift-certificate-form input[name="from_email"]',
                validate: (cb, val) => {
                    const result = purchaseModel.senderEmail(val);

                    cb(result);
                },
                errorMessage: 'You must enter a valid email.',
            },
            {
                selector: '#gift-certificate-form input[name="certificate_theme"]:first-of-type',
                triggeredBy: '#gift-certificate-form input[name="certificate_theme"]',
                validate: (cb) => {
                    const val = $purchaseForm.find('input[name="certificate_theme"]:checked').val();

                    cb(typeof(val) === 'string');
                },
                errorMessage: 'You must select a gift certificate theme.',
            },
            {
                selector: '#gift-certificate-form input[name="agree"]',
                validate: (cb) => {
                    const val = $purchaseForm.find('input[name="agree"]').get(0).checked;

                    cb(val);
                },
                errorMessage: 'You must agree to these terms.',
            },
            {
                selector: '#gift-certificate-form input[name="agree2"]',
                validate: (cb) => {
                    const val = $purchaseForm.find('input[name="agree2"]').get(0).checked;

                    cb(val);
                },
                errorMessage: 'You must agree to these terms.',
            },
        ]);

        if ($certBalanceForm.length) {
            const balanceVal = this.checkCertBalanceValidator($certBalanceForm);

            $certBalanceForm.submit(() => {
                balanceVal.performCheck();

                if (!balanceVal.areAll('valid')) {
                    return false;
                }
            });
        }

        $purchaseForm.submit((event) => {
            purchaseValidator.performCheck();

            if (!purchaseValidator.areAll('valid')) {
                return event.preventDefault();
            }
        });

        $('#gift-certificate-preview').click((event) => {
            event.preventDefault();

            purchaseValidator.performCheck();

            if (!purchaseValidator.areAll('valid')) {
                return;
            }

            const modal = defaultModal();
            const previewUrl = `${$(event.currentTarget).data('preview-url')}&${$purchaseForm.serialize()}`;

            modal.open();

            api.getPage(previewUrl, {}, (err, content) => {
                if (err) {
                    return modal.updateContent(this.context.previewError);
                }

                modal.updateContent(content, { wrap: true });
            });
        });
    }

    checkCertBalanceValidator($balanceForm) {
        const balanceValidator = nod({
            submit: $balanceForm.find('input[type="submit"]'),
        });

        balanceValidator.add({
            selector: $balanceForm.find('input[name="giftcertificatecode"]'),
            validate(cb, val) {
                cb(giftCertChecker(val));
            },
            errorMessage: 'You must enter a certificate code.',
        });

        return balanceValidator;
    }
}
