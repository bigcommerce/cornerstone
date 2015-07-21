import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';
import _ from 'lodash';

/**
 * If there are no options from bcapp, a text field will be sent. This will create a select element to hold options after the remote request.
 * @returns {jQuery|HTMLElement}
 */
function makeStateRequired(stateElement) {
    let attrs,
        $newElement;

    attrs = _.transform(stateElement.prop('attributes'), (result, item) => {
        result[item.name] = item.value;
        return result;
    });

    stateElement.replaceWith(`<select id="${attrs.id}" data-label="${attrs['data-label']}" class="form-select" name="${attrs.name}"></select>`);

    $newElement = $('[data-label="State/Province"]');
    $newElement.prev().find('small').show();

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

    let fieldId = attrs.name.match(/(\[.*\])/);

    stateElement.replaceWith(`<input type="text" id="${attrs.id}" data-label="${attrs['data-label']}" class="form-input" name="${attrs.name}">
    <input type="hidden" name="FormFieldIsText${fieldId}" value="1">`);

    $newElement = $('[data-label="State/Province"]');
    $newElement.prev().find('small').hide();

    return $newElement;
}

/**
 * Adds the array of options from the remote request to the newly created select box.
 * @param statesArray
 * @param $selectElement
 */
function addOptions(statesArray, $selectElement) {
    let container = [];
    container.push(`<option>${statesArray.prefix}</option>`);
    if (!_.isEmpty($selectElement)){
        _.each(statesArray.states, (stateObj)  => {
            container.push(`<option value="${stateObj.name}">${stateObj.name}</option>`);
        });
        $selectElement.html(container.join(' '));
    }
}

export default function (stateElement, callback) {

    $('select[data-label="Country"]').on('change', (event) => {
        let countryName = $(event.currentTarget).val();

        if (countryName === '') {
            return;
        }

        utils.api.country.getByName(countryName, (err, response) => {
            let $currentInput;

            if (err) {
                alert('There was an error');
            }

            $currentInput = $('[data-label="State/Province"]');

            if (!_.isEmpty(response.data.states)) {
                // The element may have been replaced with a select, reselect it
                let $selectElement = makeStateRequired($currentInput);
                addOptions(response.data, $selectElement);
                callback($selectElement);

            } else {
                let newElement = makeStateOptional($currentInput);
                callback(newElement);
            }
        })
    });
}
