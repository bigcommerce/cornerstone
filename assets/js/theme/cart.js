import PageManager from '../page-manager';
import $ from 'jquery';
import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';

export default class Cart extends PageManager {
    loaded(next) {

        this.debounceTimeout = 400;

        this.bindEvents();

        next();
    }
    
    cartUpdate($target) {
        let itemId = $target.data('cart-itemid'),
            $el = $('#qty-' + itemId),
            oldQty = parseInt($el.text()),
            newQty;

        newQty = $target.data('action') === 'inc' ? oldQty + 1 : oldQty - 1;
        $el.text(newQty);
        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            if (response.data.status === 'succeed') {
                this.refreshContent();
            } else {
                $el.text(oldQty);
                alert(response.data.errors.join('\n'));
            }
        });
    }

    cartRemoveItem(itemId) {
        utils.api.cart.itemRemove(itemId, (err, response) => {
            if (response.data.status === 'succeed') {
                this.refreshContent();
            } else {
                alert(response.data.errors.join('\n'));
            }
        });
    }

    refreshContent() {
        utils.api.cart.getContent('cart/content', (err, response) => {
            $('[data-cart-content]').html(response.content);
            this.bindEvents();
        });
    }

    bindEvents() {
        let $container = $('.estimator-wrapper');

        // cart update
        $('.cart-update').on('click', (event) => {
            let $target = $(event.currentTarget);

            // prevent form submission
            event.preventDefault();

            // update cart quantity
            _.bind(_.debounce(this.cartUpdate, this.debounceTimeout), this)($target);
        });

        $('.cart-remove').on('click', (event) => {
            let itemId = $(event.currentTarget).data('cart-itemid');

            // prevent form submission
            event.preventDefault();

            // remove item from cart
            this.cartRemoveItem(itemId);
        });

        $('.shipping-estimate-submit').on('click', (event) => {
            let $form = $('.shipping-estimate'),
                params = {
                    country_id: $('[name="country"]', $form).val(),
                    state_id: $('[name="state"]', $form).val(),
                    zip_code: $('[name="zip"]', $form).val()
                };

            event.preventDefault();

            utils.api.cart.getShippingQuotes(params, 'cart/shipping-quotes', (err, response) => {
                $('.shipping-quotes').html(response.content);

                // bind the select button
                $('.select-shipping-quote').on('click', (event) => {
                    let quoteId = $('.shipping-quote:checked').val();
                    event.preventDefault();
                    utils.api.cart.submitShippingQuote(quoteId, (response) => {

                        this.refreshContent();
                    });
                });
            });
        });

        $('.shipping-estimate-show').on('click', (event) => {
            event.preventDefault();
            $(event.currentTarget).hide();
            $container.show();
        });


        $('.shipping-estimate-hide').on('click', (event) => {
            event.preventDefault();
            $container.hide();
            $('.shipping-estimate-show').show();
        });

        $container.hide();
    }
}
