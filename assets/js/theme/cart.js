import PageManager from '../page-manager';
import $ from 'jquery';
import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';
import ShippingEstimator from './cart/shipping-estimator';

export default class Cart extends PageManager {
    loaded(next) {
        this.$cartContent = $('[data-cart-content]');
        this.$cartTotals = $('[data-cart-totals]');
        this.$overlay = $('[data-cart] .loadingOverlay')
            .hide(); // TODO: temporary until roper pulls in his cart components

        this.bindEvents();

        // initiate shipping estimator module
        this.shippingEstimator = new ShippingEstimator($('[data-shipping-estimator]'));

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
        let $cartItemsRows = $('[data-item-row]', this.$cartContent),
            $cartPageTitle = $('[data-cart-page-title]'),
            options = {
                template: {
                    content: 'cart/content',
                    totals: 'cart/totals',
                    pageTitle: 'cart/page-title'
                }
            };

        this.$overlay.show();

        // Remove last item from cart? Reload
        if (remove && $cartItemsRows.length === 1) {
            return window.location.reload();
        }


        utils.api.cart.getContent(options, (err, response) => {
            let quantity;

            this.$cartContent.html(response.content);
            this.$cartTotals.html(response.totals);
            $cartPageTitle.replaceWith(response.pageTitle);
            this.bindEvents();
            this.$overlay.hide();

            quantity = $('[data-cart-quantity]', this.$cartContent).data('cart-quantity') || 0;
            $('body').trigger('cart-quantity-update', quantity);
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

            // Empty code
            if (!code) {
                return alert($codeInput.data('error'));
            }

            utils.api.cart.applyCode(code, (err, response) => {
                if (response.data.status === 'success') {
                    this.refreshContent();
                } else {
                    alert(response.data.errors.join('\n'));
                }
            });
        });
    }

    bindGiftCertificateEvents() {
        let $certContainer = $('.gift-certificate-code'),
            $certForm = $('.gift-certificate-form'),
            $certInput = $('[name="certcode"]', $certForm);

        $('.gift-certificate-add').on('click', (event) => {
            event.preventDefault();
            $(event.currentTarget).toggle();
            $certContainer.toggle();
            $('.gift-certificate-cancel').toggle();
        });

        $('.gift-certificate-cancel').on('click', (event) => {
            event.preventDefault();
            $certContainer.toggle();
            $('.gift-certificate-add').toggle();
            $('.gift-certificate-cancel').toggle();
        });

        $certForm.on('submit', (event) => {
            let code = $certInput.val();

            event.preventDefault();
            if (!code) {
                return alert($certInput.data('error'));
            }

            utils.api.cart.applyGiftCertificate(code, (err, resp) => {
                if (resp.data.status === 'success') {
                    this.refreshContent();
                } else {
                    alert(resp.data.errors.join('\n'));
                }
            });
        });
    }

    bindGiftWrappingEvents() {
        let $modal = $('#modal'),
            $modalContent = $('.modal-content', $modal),
            $modalOverlay = $('.loadingOverlay', $modal);

        $('[data-item-giftwrap]').on('click', (event) => {
            let itemId = $(event.currentTarget).data('item-giftwrap'),
                options = {
                    template: 'cart/modals/gift-wrapping-form'
                };

            event.preventDefault();

            // clear the modal
            $modalContent.html('');
            $modalOverlay.show();

            // open modal
            $modal.foundation('reveal', 'open');

            utils.api.cart.getItemGiftWrappingOptions(itemId, options, (err, response) => {
                $modalOverlay.hide();
                $modalContent.html(response.content);

                this.bindGiftWrappingForm();
            });
        });
    }

    bindGiftWrappingForm() {
        $('.giftWrapping-select').change((event) => {
            let $select = $(event.currentTarget),
                id = $select.val(),
                index = $select.data('index'),
                allowMessage;

            if (!id) {
                return;
            }

            allowMessage = $select.find('option[value=' + id + ']').data('allow-message');

            $('.giftWrapping-image-' + index).hide();
            $('#giftWrapping-image-' + index + '-' + id).show();

            if (allowMessage) {
                $('#giftWrapping-message-' + index).show();
            } else {
                $('#giftWrapping-message-' + index).hide();
            }
        });

        $('.giftWrapping-select').trigger('change');

        function toggleViews() {
            let value = $('input:radio[name ="giftwraptype"]:checked').val(),
                $singleForm = $('.giftWrapping-single'),
                $multiForm = $('.giftWrapping-multiple');

            if (value === 'same') {
                $singleForm.show();
                $multiForm.hide();
            }  else {
                $singleForm.hide();
                $multiForm.show();
            }
        }

        $('[name="giftwraptype"]').click(toggleViews);
        toggleViews();
    }

    bindEvents() {
        this.bindCartEvents();
        this.bindPromoCodeEvents();
        this.bindGiftWrappingEvents();
        this.bindGiftCertificateEvents();
    }
}
