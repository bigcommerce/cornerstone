import $ from 'jquery';

/**
 * Validate that the given date for the day/month/year select inputs is within potential range
 * @param $formField
 * @param validation
 * @returns {{selector: string, triggeredBy: string, validate: Function, errorMessage: string}}
 */
function buildDateValidation($formField, validation) {
    // No date range restriction, skip
    if (!(validation.min_date && validation.max_date)) {
        return;
    }

    let invalidMessage = `Your chosen date must fall between ${validation.min_date} and ${validation.max_date}`,
        formElementId = $formField.attr('id'),
        minSplit = validation.min_date.split('-'),
        maxSplit = validation.max_date.split('-'),
        minDate = new Date(minSplit[0], minSplit[1] - 1, minSplit[2]),
        maxDate = new Date(maxSplit[0], maxSplit[1] - 1, maxSplit[2]);

    return {
        selector: `#${formElementId} select[data-label="year"]`,
        triggeredBy: `#${formElementId} select:not([data-label="year"])`,
        validate: (cb, val) => {
            let day = Number($formField.find('select[data-label="day"]').val()),
                month = Number($formField.find('select[data-label="month"]').val()) - 1,
                year = Number(val),
                chosenDate = new Date(year, month, day);

            cb(chosenDate >= minDate && chosenDate <= maxDate);
        },
        errorMessage: invalidMessage
    };
}

/**
 * We validate checkboxes separately from single input fields, as they must have at least one checked option
 * from many different inputs
 * @param $formField
 * @param validation
 */
function buildRequiredCheckboxValidation($formField, validation) {
    let formFieldId = $formField.attr('id'),
        primarySelector = `#${formFieldId} input:first-of-type`,
        secondarySelector = `#${formFieldId} input`;

    return {
        selector: primarySelector,
        triggeredBy: secondarySelector,
        validate: (cb) => {
            let result = false;

            $(secondarySelector).each(function(index, checkbox) {
                if (checkbox.checked) {
                    result = true;
                    return false;
                }
            });

            cb(result);
        },
        errorMessage: `The '${validation.label}' field can not be blank`
    };
}

function buildRequiredValidation(validation, selector) {
    return {
        selector: selector,
        validate: (cb, val) => {
            cb(val.length > 0);
        },
        errorMessage: `The '${validation.label}' field can not be blank`
    };
}

function buildNumberRangeValidation(validation, formFieldSelector) {
    let invalidMessage = `The value for ${validation.label} must be between ${validation.min} and ${validation.max}`,
        min = Number(validation.min),
        max = Number(validation.max);

    return {
        selector: `${formFieldSelector} input[name="${validation.name}"]`,
        validate: (cb, val) => {
            val = Number(val);

            cb(val >= min && val <= max);
        },
        errorMessage: invalidMessage
    };
}


function buildValidation($validateableElement) {
    let validation = $validateableElement.data('validation'),
        fieldValidations = [],
        formFieldSelector = `#${$validateableElement.attr('id')}`;

    if (validation.type === 'datechooser') {
        let dateValidation = buildDateValidation($validateableElement, validation);

        if (dateValidation) {
            fieldValidations.push(dateValidation);
        }
    } else if (validation.required && (validation.type === 'checkboxselect' || validation.type === 'radioselect')) {
        fieldValidations.push(buildRequiredCheckboxValidation($validateableElement, validation));
    } else {
        $validateableElement.find('input, select, textarea').each(function(index, element) {
            let $inputElement = $(element),
                tagName = $inputElement.get(0).tagName,
                inputName = $inputElement.attr('name'),
                elementSelector = `${formFieldSelector} ${tagName}[name="${inputName}"]`;

            if (validation.type === 'numberonly') {
                fieldValidations.push(buildNumberRangeValidation(validation, formFieldSelector));
            }
            if (validation.required) {
                fieldValidations.push(buildRequiredValidation(validation, elementSelector));
            }
        });
    }

    return fieldValidations;
}

/**
 * Builds the validation model for dynamic forms
 * @param $form
 * @returns {Array}
 */
export default function($form) {
    let validationsToPerform = [];

    $form.find('[data-validation]').each(function(index, input) {
        validationsToPerform = validationsToPerform.concat(buildValidation($(input)));
    });

    return validationsToPerform;
}
