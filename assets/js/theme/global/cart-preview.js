import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import utils from 'bigcommerce/stencil-utils';

export default function () {
    let loadingClass = 'is-loading',
        $cart = $('[data-cart-preview]'),
        $cartDropdown = $('#cart-preview-dropdown'),
        $cartLoading = $('<div class="loadingOverlay"></div>');


    $('body').on('cart-quantity-update', (event, quantity) => {
        $('.cart-quantity')
            .text(quantity)
            .toggleClass('countPill--positive', quantity > 0);
    });

    $cart.on('click', (event) => {
        let options = {
            template: 'common/cart-preview'
        };

        $cartDropdown
            .addClass(loadingClass)
            .html($cartLoading);

        event.preventDefault();

        utils.api.cart.getContent(options, (err, response) => {
            let quantity;

            $cartDropdown
                .removeClass(loadingClass)
                .html(response);

            quantity = $('[data-cart-quantity]', $cartDropdown).data('cart-quantity') || 0;
            $('body').trigger('cart-quantity-update', quantity);
        });
    });
}
