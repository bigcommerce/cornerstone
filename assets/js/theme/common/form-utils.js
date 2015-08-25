import $ from 'jquery';
import _ from 'lodash';
import nod from './nod';
import forms from './models/forms';

let inputTagNames = [
    'input',
    'select',
    'textarea'
];

const VALIDATION_PASSWORD_ALPHA_REGEX = /[A-Za-z]/;
const VALIDATION_PASSWORD_NUMERIC_REGEX = /[0-9]/;

/**
 * Apply class name to an input element on its type
 * @param {object} input
 * @param {string} formFieldClass
 * @return {object} Element itself
 */
function classifyInput(input, formFieldClass) {
    let $input = $(input),
        $formField = $input.parent(`.${formFieldClass}`),
        tagName = $input.prop('tagName').toLowerCase(),
        className = `${formFieldClass}--${tagName}`,
        specificClassName;

    // Input can be text/checkbox/radio etc...
    if (tagName === 'input') {
        let inputType = $input.prop('type');

        if (_.contains(['radio', 'checkbox', 'submit'], inputType)) {
            // ie: .form-field--checkbox, .form-field--radio
            className = `${formFieldClass}--${_.camelCase(inputType)}`
        } else {
            // ie: .form-field--input .form-field--inputText
            specificClassName = `${className}${_.capitalize(inputType)}`
        }
    }

    // Apply class modifier
    return $formField
        .addClass(className)
        .addClass(specificClassName);
}

/**
 * Apply class name to each input element in a form based on its type
 * @example
 * // Before
 * <form id="form">
 *     <div class="form-field">
 *         <input type="text">
 *     </div>
 *     <div class="form-field">
 *         <select>...</select>
 *     </div>
 * </form>
 *
 * classifyForm('#form', { formFieldClass: 'form-field' });
 *
 * // After
 * <div class="form-field form-field--input form-field--inputText">...</div>
 * <div class="form-field form-field--select">...</div>
 *
 * @param {string|object} formSelector - selector or element
 * @param {object} options
 * @return {jQuery} Element itself
 */
export function classifyForm(formSelector, options = {}) {
    let $form = $(formSelector),
        $inputs = $form.find(inputTagNames.join(', '));

    // Obtain options
    let { formFieldClass = 'form-field' } = options;

    // Classify each input in a form
    $inputs.each((__, input) => {
        classifyInput(input, formFieldClass);
    });

    return $form;
}

/**
 * Get id from given field
 * @param {object} $field JQuery field object
 * @return {string}
 */
function getFieldId($field) {
    let fieldId = $field.prop('name').match(/(\[.*\])/);

    if (fieldId && fieldId.length !== 0) {
        return fieldId[0];
    }

    return '';
}

/**
 * Insert hidden field after State/Province field
 * @param {object} $stateField JQuery field object
 */
function insertStateHiddenField($stateField) {
    let fieldId = getFieldId($stateField),
        stateFieldAttrs = {
            type: 'hidden',
            name: `FormFieldIsText${fieldId}`,
            value: '1'
    };

    $stateField.after($('<input />', stateFieldAttrs))
}

let Validators = {
    /**
     * Sets up a new validation when the form is dirty
     * @param validator
     * @param field
     */
    setEmailValidation: (validator, field) => {
        if (field) {
            validator.add({
                selector: field,
                validate: (cb, val) => {
                    let result = forms.email(val);
                    cb(result);
                },
                errorMessage: 'You must enter a valid email'
            })
        }
    },

    /**
     * Validate password fields
     * @param validator
     * @param passwordSelector
     * @param password2Selector
     * @param isOptional
     */
    setPasswordValidation: (validator, passwordSelector, password2Selector, isOptional) => {
        let $password = $(passwordSelector),
            $password2 = $(password2Selector),
            passwordValidations = [
                {
                    selector: passwordSelector,
                    validate: (cb, val) => {
                        let result = val.length;

                        if (isOptional) {
                            return cb(true);
                        }

                        cb(result);
                    },
                    errorMessage: 'You must enter a password'
                },
                {
                    selector: passwordSelector,
                    validate: (cb, val) => {
                        let result = val.match(VALIDATION_PASSWORD_ALPHA_REGEX)
                            && val.match(VALIDATION_PASSWORD_NUMERIC_REGEX)
                            && val.length >= 7;

                        // If optional and nothing entered, it is valid
                        if (isOptional && val.length === 0) {
                            return cb(true);
                        }

                        cb(result);
                    },
                    errorMessage: 'Your password must contain letters, numbers, and be at least 7 characters'
                },
                {
                    selector: password2Selector,
                    validate: (cb, val) => {
                        let result = val.length;

                        if (isOptional) {
                            return cb(true);
                        }

                        cb(result);
                    },
                    errorMessage: 'You must enter a password'
                },
                {
                    selector: password2Selector,
                    validate: (cb, val) => {
                        let result = val === $password.val();

                        cb(result);
                    },
                    errorMessage: 'Your passwords do not match'
                }
            ];

        validator.add(passwordValidations);
    },

    /**
     * Sets up a new validation when the form is dirty
     * @param validator
     * @param field
     */
    setStateCountryValidation: (validator, field) => {
        if (field) {
            validator.add({
                selector: field,
                validate: 'presence',
                errorMessage: 'The State/Province field cannot be blank'
            })
        }
    },

    /**
     * Removes classes from dirty form if previously checked
     * @param field
     */
    cleanUpStateValidation: (field) => {
        let $fieldClassElement = $((`[data-type="${field.data('field-type')}"]`));

        Object.keys(nod.classes).forEach((value) => {
            if ($fieldClassElement.hasClass(nod.classes[value])) {
                $fieldClassElement.removeClass(nod.classes[value]);
            }
        })
    }
};

export {Validators, insertStateHiddenField}
