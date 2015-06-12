import PageManager from '../page-manager';
import nod from 'github:casperin/nod@2.0.4/nod';
export default class GiftCertificate extends PageManager {
    constructor() {
        super();

        let purchaseModel = {
                recipientName: function(val) {
                    return val.length;
                },
                recipientEmail: function(value) {
                    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    return re.test(value);
                },
                senderName: function(val) {
                    return val.length;
                },
                senderEmail: function(value) {
                    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                    return re.test(value);
                },
                customAmount: function(value, min, max) {
                    return value && value >= min && value <= max;
                },
                setAmount: function(value, options) {
                    let found = false;

                    options.forEach(function(option) {
                        if (option == value) {
                            found = true;
                            return false;
                        }
                    });

                    return found;
                }
            },
            customAmounts = $('.gift-certificate-form input[name="certificate_amount"]'),
            amountValidator;

        nod.classes.errorClass = 'form-field--error';
        nod.classes.successClass = 'form-field--success';
        nod.classes.errorMessageClass = 'form-inlineMessage';

        this.purchaseValidator = nod({
            submit: '.gift-certificate-form input[type="submit"]',
            disableSubmit: true,
            delay: 300
        });

        if (customAmounts.length) {
            amountValidator = {
                selector: '.gift-certificate-form input[name="certificate_amount"]',
                validate: (cb, val) => {
                    var result = purchaseModel.recipientEmail(val);
                    cb(result);
                },
                errorMessage: "You must enter a certificate amount"
            };
        }


        this.purchaseValidator.add([
            {
                selector: '.gift-certificate-form input[name="to_name"]',
                validate: (cb, val) => {
                    var result = purchaseModel.recipientName(val);
                    cb(result);
                },
                errorMessage: "You must enter a valid recipient name"
            },
            {
                selector: '.gift-certificate-form input[name="to_email"]',
                validate: (cb, val) => {
                    var result = purchaseModel.recipientEmail(val);
                    cb(result);
                },
                errorMessage: "You must enter a valid recipient email"
            },
            {
                selector: '.gift-certificate-form input[name="from_name"]',
                validate: (cb, val) => {
                    var result = purchaseModel.recipientEmail(val);
                    cb(result);
                },
                errorMessage: "You must enter your name"
            },
            {
                selector: '.gift-certificate-form input[name="from_email"]',
                validate: (cb, val) => {
                    var result = purchaseModel.recipientEmail(val);
                    cb(result);
                },
                errorMessage: "You must enter your email"
            }
        ]);
    }
}
