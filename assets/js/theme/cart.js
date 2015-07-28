import PageManager from '../page-manager';
import $ from 'jquery';
import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';

export default class Cart extends PageManager {
    loaded(next) {
        this.$cartContent = $('[data-cart-content]');
        this.$overlay = $('[data-cart] .loadingOverlay')
            .hide(); // TODO: temporary until roper pulls in his cart components

        this.bindEvents();
        next();
    }

    cartUpdate($target) {
        let itemId = $target.data('cart-itemid'),
            $el = $('#qty-' + itemId),
            oldQty = parseInt($el.val(), 10),
            newQty;

        this.$overlay.show();
        newQty = $target.data('action') === 'inc' ? oldQty + 1 : oldQty - 1;
        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            this.$overlay.hide();

            if (response.data.status === 'succeed') {
                // if the quantity is changed "1" from "0", we have to remove the row.
                let remove = (newQty === 0);
                this.refreshContent(remove);
            } else {
                $el.val(oldQty);
                alert(response.data.errors.join('\n'));
            }
        });
    }

    cartRemoveItem(itemId) {
        this.$overlay.show();
        utils.api.cart.itemRemove(itemId, (err, response) => {
            if (response.data.status === 'succeed') {
                this.refreshContent(true);
            } else {
                alert(response.data.errors.join('\n'));
            }
        });
    }

    refreshContent(remove) {
        let $cartItemsRows = $('[data-item-row]', this.$cartContent);

        // Remove last item from cart? Reload
        if (remove && $cartItemsRows.length == 1) {
            return window.location.reload();
        }

        utils.api.cart.getContent({template: 'cart/content'}, (err, response) => {
            this.$cartContent.html(response.content);
            this.bindEvents();
            this.$overlay.hide();
        });
    }

    bindCartEvents() {
        let debounceTimeout = 400,
            cartUpdate = _.bind(_.debounce(this.cartUpdate, debounceTimeout), this),
            cartRemoveItem = _.bind(_.debounce(this.cartRemoveItem, debounceTimeout), this);

        // cart update
        $('[data-cart-update]', this.$cartContent).on('click', (event) => {
            let $target = $(event.currentTarget);

            event.preventDefault();
            // update cart quantity
            cartUpdate($target);
        });

        $('.cart-remove', this.$cartContent).on('click', (event) => {
            let itemId = $(event.currentTarget).data('cart-itemid');

            event.preventDefault();
            // remove item from cart
            cartRemoveItem(itemId);
        });
    }

    bindPromoCodeEvents() {
        let $couponContainer = $('.coupon-code'),
            $couponForm = $('.coupon-form'),
            $codeInput = $('[name="couponcode"]', $couponForm);

        $('.coupon-code-add').on('click', (event) => {
            event.preventDefault();

            $(event.currentTarget).hide();
            $couponContainer.show();
            $('.coupon-code-cancel').show();
            $codeInput.focus();
        });

        $('.coupon-code-cancel').on('click', (event) => {
            event.preventDefault();

            $couponContainer.hide();
            $('.coupon-code-cancel').hide();
            $('.coupon-code-add').show();
        });

        $couponForm.on('submit', (event) => {
            let code = $codeInput.val();

            event.preventDefault();

            utils.api.cart.applyCode(code, (err, response) => {
                if (response.data.status === 'succeed') {
                    this.refreshContent();
                } else {
                    alert(response.data.errors.join('\n'));
                }
            });
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

                    utils.api.cart.submitShippingQuote(quoteId, (response) => {
                        this.refreshContent();
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


    bindGiftWrappingEvents() {


        $('[data-add-giftwrap]').on('click', (event) => {
            let itemId = $(event.currentTarget).data('add-giftwrap'),
                options = {
                    template: 'cart/modals/gift-wrapping-form'
                }

            event.preventDefault();

            utils.api.cart.getItemGiftWrappingOptions(itemId, options, (err, response) => {
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


        $('.shipping-estimate-hide').on('click', (event) => {
            event.preventDefault();

            $estimatorContainer.hide();
            $('.shipping-estimate-show').show();
            $('.shipping-estimate-hide').hide();
        });
    }

    bindEvents() {
        this.bindCartEvents();
        this.bindPromoCodeEvents();
        this.bindEstimatorEvents();
        this.bindGiftWrappingEvents();
    }
}
