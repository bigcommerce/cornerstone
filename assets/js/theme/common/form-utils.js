import _ from 'lodash';
import nod from './nod';
import forms from './models/forms';

const inputTagNames = [
    'input',
    'select',
    'textarea',
];

/**
 * Apply class name to an input element on its type
 * @param {object} input
 * @param {string} formFieldClass
 * @return {object} Element itself
 */
function classifyInput(input, formFieldClass) {
    const $input = $(input);
    const $formField = $input.parent(`.${formFieldClass}`);
    const tagName = $input.prop('tagName').toLowerCase();

    let className = `${formFieldClass}--${tagName}`;
    let specificClassName;

    // Input can be text/checkbox/radio etc...
    if (tagName === 'input') {
        const inputType = $input.prop('type');

        if (_.includes(['radio', 'checkbox', 'submit'], inputType)) {
            // ie: .form-field--checkbox, .form-field--radio
            className = `${formFieldClass}--${_.camelCase(inputType)}`;
        } else {
            // ie: .form-field--input .form-field--inputText
            specificClassName = `${className}${_.capitalize(inputType)}`;
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
    const $form = $(formSelector);
    const $inputs = $form.find(inputTagNames.join(', '));

    // Obtain options
    const { formFieldClass = 'form-field' } = options;

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
    const fieldId = $field.prop('name').match(/(\[.*\])/);

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
    const fieldId = getFieldId($stateField);
    const stateFieldAttrs = {
        type: 'hidden',
        name: `FormFieldIsText${fieldId}`,
        value: '1',
    };

    $stateField.after($('<input />', stateFieldAttrs));
}

const Validators = {
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
                    const result = forms.email(val);

                    cb(result);
                },
                errorMessage: 'You must enter a valid email.',
            });
        }
    },

    /**
     * Validate password fields
     * @param validator
     * @param passwordSelector
     * @param password2Selector
     * @param requirements
     * @param isOptional
     */
    setPasswordValidation: (validator, passwordSelector, password2Selector, requirements, isOptional) => {
        const $password = $(passwordSelector);
        const passwordValidations = [
            {
                selector: passwordSelector,
                validate: (cb, val) => {
                    const result = val.length;

                    if (isOptional) {
                        return cb(true);
                    }

                    cb(result);
                },
                errorMessage: 'You must enter a password.',
            },
            {
                selector: passwordSelector,
                validate: (cb, val) => {
                    const result = val.match(new RegExp(requirements.alpha))
                        && val.match(new RegExp(requirements.numeric))
                        && val.length >= requirements.minlength;

                    // If optional and nothing entered, it is valid
                    if (isOptional && val.length === 0) {
                        return cb(true);
                    }

                    cb(result);
                },
                errorMessage: requirements.error,
            },
            {
                selector: password2Selector,
                validate: (cb, val) => {
                    const result = val.length;

                    if (isOptional) {
                        return cb(true);
                    }

                    cb(result);
                },
                errorMessage: 'You must enter a password.',
            },
            {
                selector: password2Selector,
                validate: (cb, val) => {
                    const result = val === $password.val();

                    cb(result);
                },
                errorMessage: 'Your passwords do not match.',
            },
        ];

        validator.add(passwordValidations);
    },

    /**
     * Validate password fields
     * @param {Nod} validator
     * @param {Object} selectors
     * @param {string} selectors.errorSelector
     * @param {string} selectors.fieldsetSelector
     * @param {string} selectors.formSelector
     * @param {string} selectors.maxPriceSelector
     * @param {string} selectors.minPriceSelector
     */
    setMinMaxPriceValidation: (validator, selectors) => {
        const {
            errorSelector,
            fieldsetSelector,
            formSelector,
            maxPriceSelector,
            minPriceSelector,
        } = selectors;

        validator.configure({
            form: formSelector,
            preventSubmit: true,
            successClass: '_', // KLUDGE: Don't apply success class
        });

        validator.add({
            errorMessage: 'Min price must be less than max. price.',
            selector: minPriceSelector,
            validate: `min-max:${minPriceSelector}:${maxPriceSelector}`,
        });

        validator.add({
            errorMessage: 'Min price must be less than max. price.',
            selector: maxPriceSelector,
            validate: `min-max:${minPriceSelector}:${maxPriceSelector}`,
        });

        validator.add({
            errorMessage: 'Max. price is required.',
            selector: maxPriceSelector,
            validate: 'presence',
        });

        validator.add({
            errorMessage: 'Min. price is required.',
            selector: minPriceSelector,
            validate: 'presence',
        });

        validator.add({
            errorMessage: 'Input must be greater than 0.',
            selector: [minPriceSelector, maxPriceSelector],
            validate: 'min-number:0',
        });

        validator.setMessageOptions({
            selector: [minPriceSelector, maxPriceSelector],
            parent: fieldsetSelector,
            errorSpan: errorSelector,
        });
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
                errorMessage: 'The \'State/Province\' field cannot be blank.',
            });
        }
    },

    /**
     * Removes classes from dirty form if previously checked
     * @param field
     */
    cleanUpStateValidation: (field) => {
        const $fieldClassElement = $((`[data-type="${field.data('fieldType')}"]`));

        Object.keys(nod.classes).forEach((value) => {
            if ($fieldClassElement.hasClass(nod.classes[value])) {
                $fieldClassElement.removeClass(nod.classes[value]);
            }
        });
    },
};

export { Validators, insertStateHiddenField };
