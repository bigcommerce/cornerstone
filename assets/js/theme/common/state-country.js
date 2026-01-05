import utils from '@bigcommerce/stencil-utils';
import _ from 'lodash';
import { insertStateHiddenField } from './utils/form-utils';
import { showAlertModal } from '../global/modal';

/**
 * Extracts attributes from a jQuery element into a plain object
 * @param {jQuery} element - The element to extract attributes from
 * @returns {Object} Plain object with attribute name-value pairs
 */
function getElementAttributes(element) {
    return _.transform(element.prop('attributes'), (result, item) => {
        const ret = result;
        ret[item.name] = item.value;
        return ret;
    });
}

/**
 * Creates a select element for states when the country has states AND they are required
 * @param {jQuery} stateElement - The current state input element
 * @param {Object} context - Context object containing translated strings
 * @returns {jQuery} The new select element
 */
function makeStateSelectRequired(stateElement, context) {
    const attrs = getElementAttributes(stateElement);

    const replacementAttributes = {
        ...attrs,
        class: 'form-select',
        'aria-required': 'true',
    };

    stateElement.replaceWith($('<select></select>', replacementAttributes));

    const $newElement = $('[data-field-type="State"]');
    const $hiddenInput = $('[name*="FormFieldIsText"]');

    if ($hiddenInput.length !== 0) {
        $hiddenInput.remove();
    }

    if ($newElement.prev().find('small').length === 0) {
        // String is injected from localizer
        $newElement.prev().append(`<small>${context.required}</small>`);
    } else {
        $newElement.prev().find('small').show();
    }

    return $newElement;
}

/**
 * Creates a select element for states when the country has states but they are NOT required
 * @param {jQuery} stateElement - The current state input element
 * @returns {jQuery} The new select element
 */
function makeStateSelectOptional(stateElement) {
    const attrs = getElementAttributes(stateElement);

    const replacementAttributes = {
        ...attrs,
        class: 'form-select',
        'aria-required': 'false',
    };

    stateElement.replaceWith($('<select></select>', replacementAttributes));

    const $newElement = $('[data-field-type="State"]');
    const $hiddenInput = $('[name*="FormFieldIsText"]');

    if ($hiddenInput.length !== 0) {
        $hiddenInput.remove();
    }

    // Hide the required indicator since state is optional
    $newElement.prev().find('small').hide();

    return $newElement;
}

/**
 * Creates a text input for states when the country has no states list
 * @param {jQuery} stateElement - The current state element
 * @returns {jQuery} The new text input element
 */
function makeStateTextOptional(stateElement) {
    const attrs = getElementAttributes(stateElement);

    const replacementAttributes = {
        ...attrs,
        type: 'text',
        class: 'form-input',
    };

    stateElement.replaceWith($('<input />', replacementAttributes));

    const $newElement = $('[data-field-type="State"]');

    if ($newElement.length !== 0) {
        insertStateHiddenField($newElement);
        $newElement.prev().find('small').hide();
    }

    return $newElement;
}

/**
 * Adds the array of options from the remote request to the newly created select box.
 * @param {Object} statesArray
 * @param {jQuery} $selectElement
 * @param {Object} options
 */
function addOptions(statesArray, $selectElement, options) {
    const container = [];

    container.push(`<option value="">${statesArray.prefix}</option>`);

    if (!_.isEmpty($selectElement)) {
        statesArray.states.forEach((stateObj) => {
            if (options.useIdForStates) {
                container.push(`<option value="${stateObj.id}">${stateObj.name}</option>`);
            } else {
                container.push(`<option value="${stateObj.name}">${stateObj.label ? stateObj.label : stateObj.name}</option>`);
            }
        });

        $selectElement.html(container.join(' '));
    }
}

/**
 * Makes the zip/postal code field required and shows the required indicator
 * @param {jQuery} $zipElement The zip/postal code field element
 * @param {Object} context The context object containing translated strings
 */
function makeZipRequired($zipElement, context) {
    $zipElement.prop('required', true);
    // since the attribute is set within templates/components/common/forms/*,
    // we explicitly set aria-required to ensure assistive technologies announce this field correctly after dynamic changes
    $zipElement.attr('aria-required', 'true');

    if ($zipElement.prev().find('small').length === 0) {
        $zipElement.prev().append(`<small>${context.required}</small>`);
    } else {
        $zipElement.prev().find('small').show();
    }
}

/**
 * Makes the zip/postal code field optional and hides the required indicator
 *
 * DOM Structure Expectation:
 * The function assumes the following DOM structure:
 * <label>
 *   <span>Zip/Postal Code</span>
 *   <small>*</small> <!-- required indicator -->
 * </label>
 * <input data-field-type="Zip" />
 *
 * @param {jQuery} $zipElement The zip/postal code field element
 */
function makeZipOptional($zipElement) {
    $zipElement.prop('required', false);
    // since the attribute is set within templates/components/common/forms/*,
    // we explicitly set aria-required to ensure assistive technologies announce this field correctly after dynamic changes
    $zipElement.attr('aria-required', false);

    const $prevElement = $zipElement.prev();
    if ($prevElement.length > 0) {
        const $requiredIndicator = $prevElement.find('small');
        if ($requiredIndicator.length > 0) {
            $requiredIndicator.hide();
        }
    }
}

/**
 *
 * @param {jQuery} stateElement
 * @param {Object} context
 * @param {Object} options
 * @param {Function} callback
 */
// eslint-disable-next-line default-param-last
export default function (stateElement, context = {}, options, callback) {
    /**
     * Backwards compatible for three parameters instead of four
     *
     * Available options:
     *
     * useIdForStates {Bool} - Generates states dropdown using id for values instead of strings
     */
    if (typeof options === 'function') {
        /* eslint-disable no-param-reassign */
        callback = options;
        options = {};
        /* eslint-enable no-param-reassign */
    }

    $('select[data-field-type="Country"]').on('change', event => {
        const countryName = $(event.currentTarget).val();

        if (countryName === '') {
            return;
        }

        utils.api.country.getByName(countryName, (err, response) => {
            if (err) {
                showAlertModal(context.state_error);
                return callback(err);
            }

            const $currentInput = $('[data-field-type="State"]');
            const $zipInput = $('[data-field-type="Zip"]');

            const hasStates = !_.isEmpty(response.data.states);
            const requiresState = response.data.requiresSubdivision !== undefined
                ? response.data.requiresSubdivision
                : hasStates;

            let $newElement;

            if (hasStates) {
                if (requiresState) {
                    $newElement = makeStateSelectRequired($currentInput, context);
                } else {
                    $newElement = makeStateSelectOptional($currentInput);
                }
                addOptions(response.data, $newElement, options);
            } else {
                $newElement = makeStateTextOptional($currentInput);
            }

            if ($zipInput.length > 0) {
                // Default to true when requiresPostalCodes is undefined to maintain original behavior
                const requiresZip = response.data.requiresPostalCodes !== undefined
                    ? response.data.requiresPostalCodes
                    : true;

                if (requiresZip) {
                    makeZipRequired($zipInput, context);
                } else {
                    makeZipOptional($zipInput);
                }
            }

            callback(null, $newElement, requiresState);
        });
    });
}
