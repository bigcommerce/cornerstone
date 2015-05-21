import $ from 'jquery';
import PageManager from '../page-manager';
import utils from 'bigcommerce/stencil-utils';
import _ from 'lodash';

export default class Auth extends PageManager {
    constructor() {
        this.$stateElement = $('[data-label="State/Province"]');
        super();
    }

    /**
     * Request is made in this function to the remote endpoint and pulls back the states for country.
     * @param next
     */
    loaded(next) {
        $('select[data-label="Country"]').on('change', (event) => {
            let countryName = $(event.currentTarget).val();

            utils.country.getByName(countryName, (err, statesArray) => {
                if (err) {
                    alert('There was an error');
                }
                if (!_.isEmpty(statesArray)) {
                    let $selectElement = this.changeInputToSelect();
                    this.addOptions(statesArray, $selectElement);

                } else {
                    $('[data-label="State/Province"]').replaceWith(this.$stateElement.get(0));
                }
            })
        });

        next();
    }

    /**
     * If there are no options from bcapp, a text field will be sent. This will create a select element to hold options after the remote request.
     * @returns {jQuery|HTMLElement}
     */
    changeInputToSelect() {
        let attrs;

        attrs = _.transform(this.$stateElement.prop('attributes'), (result, item) => {
            result[item.name] = item.value;
            return result;
        });

        this.$stateElement.replaceWith(`<select id="${attrs.id}" data-label="${attrs['data-label']}" class="${attrs.class}" name="${attrs.name}"></select>`);
        return $('[data-label="State/Province"]');
    }

    /**
     * Adds the array of options from the remote request to the newly created select box.
     * @param statesArray
     * @param $selectElement
     */
    addOptions(statesArray, $selectElement) {
        let container = [];
        if (!_.isEmpty($selectElement)){
            _.each(statesArray, (stateObj)  => {
                container.push(`<option value="${stateObj.state}">${stateObj.state}</option>`);
            });

            $selectElement.html(container.join(' '));
        }
    }
}
