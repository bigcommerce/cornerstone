import $ from 'jquery';
import nod from 'casperin/nod'
import validation from '../common/form-validation';

export default class {
    constructor($reviewForm) {
        this.reviewForm = $reviewForm;
        this.validator = nod({
            submit: $reviewForm.find('input[type="submit"]')
        });

        nod.classes.errorClass = 'form-field--error';
        nod.classes.successClass = 'form-field--success';
        nod.classes.errorMessageClass = 'form-inlineMessage';
    }

    registerValidation() {
        this.validator.add([{
            selector: '[name="revrating"]',
            validate: 'presence',
            errorMessage: 'The Rating field cannot be blank'
        }, {
            selector: '[name="revtitle"]',
            validate: 'min-length:2',
            errorMessage: 'The Review Subject field cannot be blank'
        }, {
            selector: '[name="revtext"]',
            validate: 'min-length:2',
            errorMessage: 'The Comments field cannot be blank'
        }, {
            selector: '[name="email"]',
            validate: 'min-length:2',
            errorMessage: 'The Email field cannot be blank'
        }]);

        return this.validator;
    }

    validate() {
        return this.validator.performCheck();
    }
}
