import $ from 'jquery';
import stateCountry from '../common/state-country';
import nod from '../common/nod';
import validation from '../common/form-validation';
import utils from 'bigcommerce/stencil-utils';

export default class ShippingEstimator {

    constructor($element) {
        this.$element = $element;

        this.$state = $('[data-field-type="State"]', this.$element);
        this.initFormValidation();
        this.bindStateCountryChange();
        this.bindEstimatorEvents();
    }

    initFormValidation() {
        this.shippingEstimator = 'form[data-shipping-estimator]';
        this.shippingValidator = nod({
            submit: this.shippingEstimator + ' .shipping-estimate-submit'
        });

        $('.shipping-estimate-submit', this.$element).click((event) => {
            this.shippingValidator.performCheck();

            if (this.shippingValidator.areAll('valid')) {
                return;
            }

            event.preventDefault();
        });

        this.bindValidation();
    }

    bindValidation() {
        this.shippingValidator.add([
            {
                selector: this.shippingEstimator + ' select[name="shipping-country"]',
                validate: (cb, val) => {
                    let countryId = Number(val),
                        result = countryId !== 0 && !isNaN(countryId);
                    cb(result);
                },
                errorMessage: 'The \'Country\' field cannot be blank.'
            },
            {
                selector: $(this.shippingEstimator + ' select[name="shipping-state"]'),
                validate: (cb, val) => {
                    // dynamic. switching between dropdown and input.
                    let $ele = $(this.shippingEstimator + ' select[name="shipping-state"]'),
                        result;

                    if ($ele.length) {
                        let eleVal = $ele.val();
                        result = eleVal && eleVal.length && eleVal !== 'State/province';
                    } else {
                        result = true;
                    }

                    cb(result);
                },
                errorMessage: 'The \'State/Province\' field cannot be blank.'
            }
        ]);
    }

    bindStateCountryChange() {
        // Requests the states for a country with AJAX
        stateCountry(this.$state, this.context, {useIdForStates: true}, (err) => {
            if (err) {
                alert(err);
                throw new Error(err);
            }

            // When you change a country, you swap the state/province between an input and a select dropdown
            // Not all countries require the province to be filled
            // We have to remove this class when we swap since nod validation doesn't cleanup for us
            $(this.shippingEstimator).find('.form-field--success').removeClass('form-field--success');
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
            $estimatorContainer.removeClass('u-hiddenVisually');
            $('.shipping-estimate-hide').show();
        });


        $('.shipping-estimate-hide').on('click', (event) => {
            event.preventDefault();

            $estimatorContainer.addClass('u-hiddenVisually');
            $('.shipping-estimate-show').show();
            $('.shipping-estimate-hide').hide();
        });
    }
}
