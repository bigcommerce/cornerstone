import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import utils from 'bigcommerce/stencil-utils';

export default function () {
    let $cart = $('[data-cart-preview]'),
        $cartDropdown = $('#cart-preview-dropdown');

    $cart.on('click', (event) => {
        let options = {
            template: 'common/cart-preview'
        };

        event.preventDefault();

        utils.api.cart.getContent(options, (err, response) => {
            $cartDropdown.html(response.content);
        });
    });
}
