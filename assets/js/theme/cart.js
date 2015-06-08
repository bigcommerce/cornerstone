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
            el = $('#qty-' + itemId),
            oldQty = parseInt(el.text()),
            newQty;

        newQty = $target.data('action') === 'inc' ? oldQty + 1 : oldQty - 1;
        el.text(newQty);
        console.log(this);
        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            if (response.data.status === 'succeed') {
                this.refreshContent();
            } else {
                el.text(oldQty);
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
            console.log(response);
            $('[data-cart-content]').html(response.content);
            this.bindEvents();
        });
    }

    bindEvents() {
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
            let params = {
                country_id: $('.shipping-estimate [name="country"]').val(),
                state_id: $('.shipping-estimate [name="state"]').val(),
                zip_code: $('.shipping-estimate [name="zip"]').val()
            };

            event.preventDefault();

            utils.api.cart.getShippingQuotes(params, 'cart/shipping-quotes', (err, response) => {
                $('.shipping-quotes').html(response.content);
            });
        });

        $('body').on('click', 'select-shipping-quote', (event) => {
            var quoteId = $('.shipping-quote:checked').val();
            event.preventDefault();
            console.log(quoteId);
            utils.api.cart.submitShippingQuote(quoteId, (response) => {
                this.refreshContent();
            });
        });

        $('.shipping-estimate-show').on('click', (event) => {
            $(event.currentTarget).hide();
            $('.estimator-wrapper').show();
        });


        $('.shipping-estimate-hide').on('click', (event) => {
            $('.estimator-wrapper').hide();
            $('.shipping-estimate-show').show();
        });


        $('.estimator-wrapper').hide();
    }
}
