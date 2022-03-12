import { createTranslationDictionary } from './utils/translations-utils';

/**
 * Validate that the given date for the day/month/year select inputs is within potential range
 * @param $formField
 * @param validation
 * @returns {{selector: string, triggeredBy: string, validate: Function, errorMessage: string}}
 */
function buildDateValidation($formField, validation, requiredMessage) {
    // No date range restriction, skip
    if (validation.min_date && validation.max_date) {
        const invalidMessage = `Your chosen date must fall between ${validation.min_date} and ${validation.max_date}.`;
        const formElementId = $formField.attr('id');
        const minSplit = validation.min_date.split('-');
        const maxSplit = validation.max_date.split('-');
        const minDate = new Date(minSplit[0], minSplit[1] - 1, minSplit[2]);
        const maxDate = new Date(maxSplit[0], maxSplit[1] - 1, maxSplit[2]);

        return {
            selector: `#${formElementId} select[data-label="year"]`,
            triggeredBy: `#${formElementId} select:not([data-label="year"])`,
            validate: (cb, val) => {
                const day = Number($formField.find('select[data-label="day"]').val());
                const month = Number($formField.find('select[data-label="month"]').val()) - 1;
                const year = Number(val);
                const chosenDate = new Date(year, month, day);

                cb(chosenDate >= minDate && chosenDate <= maxDate);
            },
            errorMessage: invalidMessage,
        };
    }
    // Required Empty Date field
    if (validation.required && (!validation.min_date || !validation.max_date)) {
        const formElementId = $formField.attr('id');

        return {
            selector: `#${formElementId} select[data-label="year"]`,
            triggeredBy: `#${formElementId} select:not([data-label="year"])`,
            validate: (cb, val) => {
                const day = $formField.find('select[data-label="day"]').val();
                const month = $formField.find('select[data-label="month"]').val();
                const year = val;

                cb(day && month && year);
            },
            errorMessage: requiredMessage,
        };
    }
}

/**
 * We validate checkboxes separately from single input fields, as they must have at least one checked option
 * from many different inputs
 * @param $formField
 * @param validation
 * @param errorText provides error validation message
 */
function buildRequiredCheckboxValidation(validation, $formField, errorText) {
    const formFieldId = $formField.attr('id');
    const primarySelector = `#${formFieldId} input:first-of-type`;
    const secondarySelector = `#${formFieldId} input`;

    return {
        selector: primarySelector,
        triggeredBy: secondarySelector,
        validate: (cb) => {
            let result = false;

            $(secondarySelector).each((index, checkbox) => {
                if (checkbox.checked) {
                    result = true;

                    return false;
                }
            });

            cb(result);
        },
        errorMessage: errorText,
    };
}

function buildRequiredValidation(validation, selector, errorText) {
    return {
        selector,
        validate(cb, val) {
            cb(val.length > 0);
        },
        errorMessage: errorText,
    };
}

function buildNumberRangeValidation(validation, formFieldSelector) {
    const invalidMessage = `The value for ${validation.label} must be between ${validation.min} and ${validation.max}.`;
    const min = Number(validation.min);
    const max = Number(validation.max);

    return {
        selector: `${formFieldSelector} input[name="${validation.name}"]`,
        validate: (cb, val) => {
            const numberVal = Number(val);

            cb(numberVal >= min && numberVal <= max);
        },
        errorMessage: invalidMessage,
    };
}


function buildValidation($validateableElement, errorMessage) {
    const validation = $validateableElement.data('validation');
    const fieldValidations = [];
    const formFieldSelector = `#${$validateableElement.attr('id')}`;

    if (validation.type === 'datechooser') {
        const dateValidation = buildDateValidation($validateableElement, validation, errorMessage);

        if (dateValidation) {
            fieldValidations.push(dateValidation);
        }
    } else if (validation.required && (validation.type === 'checkboxselect' || validation.type === 'radioselect')) {
        fieldValidations.push(buildRequiredCheckboxValidation(validation, $validateableElement, errorMessage));
    } else {
        $validateableElement.find('input, select, textarea').each((index, element) => {
            const $inputElement = $(element);
            const tagName = $inputElement.get(0).tagName;
            const inputName = $inputElement.attr('name');
            const elementSelector = `${formFieldSelector} ${tagName}[name="${inputName}"]`;

            if (validation.type === 'numberonly') {
                fieldValidations.push(buildNumberRangeValidation(validation, formFieldSelector));
            }
            if (validation.required) {
                fieldValidations.push(buildRequiredValidation(validation, elementSelector, errorMessage));
            }
        });
    }

    return fieldValidations;
}

/**
 * Builds the validation model for dynamic forms
 * @param $form
 * @param context provides access for error messages on required fields validation
 * @returns {Array}
 */
export default function ($form, context) {
    let validationsToPerform = [];
    const { field_not_blank: requiredFieldValidationText } = createTranslationDictionary(context);

    $form.find('[data-validation]').each((index, input) => {
        const getLabel = $el => $el.first().data('validation').label;
        const requiredValidationMessage = getLabel($(input)) + requiredFieldValidationText;

        validationsToPerform = validationsToPerform.concat(buildValidation($(input), requiredValidationMessage));
    });

    return validationsToPerform;
}
