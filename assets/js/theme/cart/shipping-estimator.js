import $ from 'jquery';
import stateCountry from '../common/state-country';
import utils from 'bigcommerce/stencil-utils';

export default class ShippingEstimator {

    constructor($element) {
        this.$element = $element;

        this.$state = $('[data-field-type="State"]', this.$element);
        this.bindStateCountryChange();
        this.bindEstimatorEvents();
    }

    bindStateCountryChange() {
        // Requests the states for a country with AJAX
        stateCountry(this.$state, this.context, {useIdForStates: true}, (err) => {
            if (err) {
                alert(err);
                throw new Error(err);
            }
        });
    }

    bindEstimatorEvents() {
        let $estimatorContainer = $('.shipping-estimator'),
            $estimatorForm = $('.estimator-form');

        $estimatorForm.on('submit', (event) => {
            let params = {
                country_id: $('[name="shipping-country"]', $estimatorForm).val(),
                state_id: $('[name="shipping-state"]', $estimatorForm).val(),
                zip_code: $('[name="shipping-zip"]', $estimatorForm).val()
            };

            event.preventDefault();

            utils.api.cart.getShippingQuotes(params, 'cart/shipping-quotes', (err, response) => {
                $('.shipping-quotes').html(response.content);

                // bind the select button
                $('.select-shipping-quote').on('click', (event) => {
                    let quoteId = $('.shipping-quote:checked').val();

                    event.preventDefault();

                    utils.api.cart.submitShippingQuote(quoteId, () => {
                        location.reload();
                    });
                });
            });
        });

        $('.shipping-estimate-show').on('click', (event) => {
            event.preventDefault();

            $(event.currentTarget).hide();
            $estimatorContainer.show();
            $('.shipping-estimate-hide').show();
        });


        $('.shipping-estimate-hide').on('click', (event) => {
            event.preventDefault();

            $estimatorContainer.hide();
            $('.shipping-estimate-show').show();
            $('.shipping-estimate-hide').hide();
        });
    }
}
