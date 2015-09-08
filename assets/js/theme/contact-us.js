import PageManager from '../page-manager';
import nod from './common/nod';
import $ from 'jquery';
import forms from './common/models/forms';

export default class ContactUs extends PageManager {
    constructor() {
        super();
    }

    loaded() {
        this.registerContactFormValidation();
    }

    registerContactFormValidation() {
        let formSelector = 'form[data-contact-form]',
            contactUsValidator = nod({
                submit: `${formSelector} input[type="submit"]`
            }),
            $contactForm = $(formSelector);

        contactUsValidator.add([
            {
                selector: `${formSelector} input[name="contact_email"]`,
                validate: (cb, val) => {
                    let result = forms.email(val);
                    cb(result);
                },
                errorMessage: 'Please type in a valid email address, such as joe@aol.com.'
            },
            {
                selector: `${formSelector} textarea[name="contact_question"]`,
                validate: (cb, val) => {
                    let result = forms.notEmpty(val);
                    cb(result);
                },
                errorMessage: 'You must enter your question.'
            }
        ]);

        $contactForm.submit((event) => {
            contactUsValidator.performCheck();

            if (contactUsValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });
    }
}
