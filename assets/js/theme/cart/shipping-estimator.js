import $ from 'jquery';
import stateCountry from '../common/state-country';

export default class ShippingEstimator {

    constructor($element) {
        this.$element = $element;

        this.$state = $('[data-field-type="State"]', this.$element);
        this.bindStateCountryChange();
    }

    bindStateCountryChange() {
        // Requests the states for a country with AJAX
        stateCountry(this.$state, this.context, {useIdForStates: true}, (err, field) => {
            if (err) {
                alert(err);
                throw new Error(err);
            }
        });
    }
}
