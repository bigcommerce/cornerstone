import PageManager from '../page-manager';
import nod from './common/nod';

export default class GiftCertificate extends PageManager {
    constructor() {
        super();

        let purchaseModel = {
                recipientName: function(val) {
                    return val.length;
                },
                recipientEmail: function(value) {
                    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    return re.test(value);
                },
                senderName: function(val) {
                    return val.length;
                },
                senderEmail: function(value) {
                    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    return re.test(value);
                },
                customAmount: function(value, min, max) {
                    return value && value >= min && value <= max;
                },
                setAmount: function(value, options) {
                    let found = false;

                    options.forEach(function(option) {
                        if (option === value) {
                            found = true;
                            return false;
                        }
                    });

                    return found;
                }
            },
            $purchaseForm = $('#gift-certificate-form'),
            $customAmounts = $purchaseForm.find('input[name="certificate_amount"]'),
            purchaseValidator = nod({
                submit: '#gift-certificate-form input[type="submit"]',
                delay: 300
            });

        if ($customAmounts.length) {
            let $element = $purchaseForm.find('input[name="certificate_amount"]'),
                min = $element.data('min'),
                minFormatted = $element.data('min-formatted'),
                max = $element.data('max'),
                maxFormatted = $element.data('max-formatted');

            purchaseValidator.add({
                selector: '#gift-certificate-form input[name="certificate_amount"]',
                validate: (cb, val) => {
                    val = Number(val);

                    if (!val) {
                        cb(false);
                    }
                    cb(val >= min && val <= max);
                },
                errorMessage: `You must enter a certificate amount between ${minFormatted} and ${maxFormatted}`
            });
        }

        purchaseValidator.add([
            {
                selector: '#gift-certificate-form input[name="to_name"]',
                validate: (cb, val) => {
                    let result = purchaseModel.recipientName(val);
                    cb(result);
                },
                errorMessage: 'You must enter a valid recipient name'
            },
            {
                selector: '#gift-certificate-form input[name="to_email"]',
                validate: (cb, val) => {
                    let result = purchaseModel.recipientEmail(val);
                    cb(result);
                },
                errorMessage: 'You must enter a valid recipient email'
            },
            {
                selector: '#gift-certificate-form input[name="from_name"]',
                validate: (cb, val) => {
                    let result = purchaseModel.senderName(val);
                    cb(result);
                },
                errorMessage: 'You must enter your name'
            },
            {
                selector: '#gift-certificate-form input[name="from_email"]',
                validate: (cb, val) => {
                    let result = purchaseModel.senderEmail(val);
                    cb(result);
                },
                errorMessage: 'You must enter a valid email'
            },
            {
                selector: '#gift-certificate-form input[name="certificate_theme"]:first-of-type',
                triggeredBy: '#gift-certificate-form input[name="certificate_theme"]',
                validate: (cb, val) => {
                    val = $purchaseForm.find('input[name="certificate_theme"]:checked').val();

                    cb(typeof(val) === 'string');
                },
                errorMessage: 'You must select a gift certificate theme'
            },
            {
                selector: '#gift-certificate-form input[name="agree"]',
                validate: (cb, val) => {
                    val = $purchaseForm.find('input[name="agree"]').get(0).checked;

                    cb(val);
                },
                errorMessage: 'You must agree to these terms'
            },
            {
                selector: '#gift-certificate-form input[name="agree2"]',
                validate: (cb, val) => {
                    val = $purchaseForm.find('input[name="agree2"]').get(0).checked;

                    cb(val);
                },
                errorMessage: 'You must agree to these terms'
            }
        ]);


        $purchaseForm.submit((event) => {
            purchaseValidator.performCheck();

            if (!purchaseValidator.areAll('valid')) {
                return event.preventDefault();
            }
        });

        $('#gift-certificate-preview').click((event) => {
            let previewUrl;

            event.preventDefault();

            purchaseValidator.performCheck();
            if (!purchaseValidator.areAll('valid')) {
                return;
            }

            previewUrl = $(event.currentTarget).data('preview-url') + '&' + $purchaseForm.serialize();

            this.getPageModal(previewUrl, (err, data) => {
                if (err) {
                    // overwrite the generic error in PageManager
                    data.modal.$content.text(this.context.previewError);
                    throw err;
                }
            });
        });
    }
}
