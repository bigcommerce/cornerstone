import PageManager from '../page-manager';
import nod from './common/nod';
import validation from './common/form-validation';
import forms from './common/models/forms';

export default class ContactUs extends PageManager {
    constructor() {
        super();
    }

    loaded() {
        this.contactUsModel = forms;
        this.registerContactFormValidation();
    }

    registerContactFormValidation() {
        let contactUsValidator = nod({
            submit: '#contactus-form input[type="submit"]'
        });

        contactUsValidator.add([
            {
                selector: '#contactus-form input[name="contact_email"]',
                validate: (cb, val) => {
                    let result = this.contactUsModel.email(val);
                    cb(result);
                },
                errorMessage: "You must enter an email address"
            },
            {
                selector: '#contactus-form textarea[name="contact_question"]',
                validate: (cb, val) => {
                    let result = this.contactUsModel.notEmpty(val);
                    cb(result);
                },
                errorMessage: "You must enter your question"
            }
        ]);
    }
}
