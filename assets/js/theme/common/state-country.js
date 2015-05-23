import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';
import _ from 'lodash';

/**
 * If there are no options from bcapp, a text field will be sent. This will create a select element to hold options after the remote request.
 * @returns {jQuery|HTMLElement}
 */
function changeInputToSelect(stateElement) {
    let attrs;

    attrs = _.transform(stateElement.prop('attributes'), (result, item) => {
        result[item.name] = item.value;
        return result;
    });

    stateElement.replaceWith(`<select id="${attrs.id}" data-label="${attrs['data-label']}" class="${attrs.class}" name="${attrs.name}"></select>`);
    return $('[data-label="State/Province"]');
}

/**
 * Adds the array of options from the remote request to the newly created select box.
 * @param statesArray
 * @param $selectElement
 */
function addOptions(statesArray, $selectElement) {
    if (!_.isEmpty($selectElement)){
        let container = _.map(statesArray, (stateObj)  => {
            return `<option value="${stateObj.name}">${stateObj.name}</option>`;
        });

        $selectElement.html(container.join(' '));
    }
}

export default function (stateElement) {

    $('select[data-label="Country"]').on('change', (event) => {
        let countryName = $(event.currentTarget).val();

        utils.country.getByName(countryName, (err, statesArray) => {
            if (err) {
                alert('There was an error');
            }
            if (!_.isEmpty(statesArray)) {
                let $selectElement = changeInputToSelect(stateElement);
                addOptions(statesArray, $selectElement);

            } else {
                $('[data-label="State/Province"]').replaceWith(stateElement.get(0));
            }
        })
    });
}
