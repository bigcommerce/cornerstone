import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';
import _ from 'lodash';
import {insertStateHiddenField} from './form-utils';

/**
 * If there are no options from bcapp, a text field will be sent. This will create a select element to hold options after the remote request.
 * @returns {jQuery|HTMLElement}
 */
function makeStateRequired(stateElement, context) {
    let attrs,
        $newElement,
        $hiddenInput;

    attrs = _.transform(stateElement.prop('attributes'), (result, item) => {
        result[item.name] = item.value;
        return result;
    });

    let replacementAttributes = {
        id: attrs.id,
        'data-label': attrs['data-label'],
        class: 'form-select',
        name: attrs.name,
        'data-field-type': attrs['data-field-type']
    };

    stateElement.replaceWith($('<select></select>', replacementAttributes));


    $newElement = $('[data-field-type="State"]');
    $hiddenInput = $('[name*="FormFieldIsText"]');

    if ($hiddenInput.length !== 0) {
        $hiddenInput.remove();
    }

    if ($newElement.prev().find('small').length === 0) {

        // String is injected from localizer
        $newElement.prev().append($('<small></small>', context.required));
    } else {
        $newElement.prev().find('small').show();
    }

    return $newElement;
}

/**
 * If a country with states is the default, a select will be sent,
 * In this case we need to be able to switch to an input field and hide the required field
 */
function makeStateOptional(stateElement) {
    let attrs,
        $newElement;

    attrs = _.transform(stateElement.prop('attributes'), (result, item) => {
        result[item.name] = item.value;
        return result;
    });

    let replacementAttributes = {
        type: 'text',
        id: attrs.id,
        'data-label': attrs['data-label'],
        class: 'form-input',
        name: attrs.name,
        'data-field-type': attrs['data-field-type']
    };

    stateElement.replaceWith($('<input />', replacementAttributes));

    $newElement = $('[data-field-type="State"]');

    if ($newElement.length !== 0) {
        insertStateHiddenField($newElement);
        $newElement.prev().find('small').hide();
    }

    return $newElement;
}

/**
 * Adds the array of options from the remote request to the newly created select box.
 * @param statesArray
 * @param $selectElement
 */
function addOptions(statesArray, $selectElement) {
    let container = [];
    container.push(`<option value="">${statesArray.prefix}</option>`);
    if (!_.isEmpty($selectElement)) {
        _.each(statesArray.states, (stateObj)  => {
            container.push(`<option value="${stateObj.name}">${stateObj.name}</option>`);
        });
        $selectElement.html(container.join(' '));
    }
}

export default function (stateElement, context, callback) {
    context = context || {};

    $('select[data-field-type="Country"]').on('change', (event) => {
        let countryName = $(event.currentTarget).val();

        if (countryName === '') {
            return;
        }

        utils.api.country.getByName(countryName, (err, response) => {
            let $currentInput;

            if (err) {
                alert(context.state_error);
                return callback(err);
            }

            $currentInput = $('[data-field-type="State"]');

            if (!_.isEmpty(response.data.states)) {
                // The element may have been replaced with a select, reselect it
                let $selectElement = makeStateRequired($currentInput, context);
                addOptions(response.data, $selectElement);
                callback(null, $selectElement);

            } else {
                let newElement = makeStateOptional($currentInput, context);
                callback(null, newElement);
            }
        })
    });
}
