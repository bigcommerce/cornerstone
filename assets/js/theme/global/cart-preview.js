import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import utils from 'bigcommerce/stencil-utils';

export default function() {
    const loadingClass = 'is-loading';
    const $cart = $('[data-cart-preview]');
    const $cartDropdown = $('#cart-preview-dropdown');
    const $cartLoading = $('<div class="loadingOverlay"></div>');

    $('body').on('cart-quantity-update', (event, quantity) => {
        $('.cart-quantity')
            .text(quantity)
            .toggleClass('countPill--positive', quantity > 0);
    });

    $cart.on('click', (event) => {
        const options = {
            template: 'common/cart-preview'
        };

        $cartDropdown
            .addClass(loadingClass)
            .html($cartLoading);

        event.preventDefault();

        utils.api.cart.getContent(options, (err, response) => {
            $cartDropdown
                .removeClass(loadingClass)
                .html(response);
        });
    });
}
