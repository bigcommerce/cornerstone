import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import utils from 'bigcommerce/stencil-utils';

export default function () {
    let $cart = $('#cart-preview'),
        $cartDropdown = $('#cart-preview-dropdown');

    $cart.on('click', (event) => {

        event.preventDefault();

        utils.api.cart.getContent('common/cart-preview', (err, response) => {
            $cartDropdown.html(response.content);
        });
    });
}
