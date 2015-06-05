import PageManager from '../page-manager';
import $ from 'jquery';
import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';

export default class Cart extends PageManager {
    loaded(next) {

        let debounceTimeout = 400,
            cartUpdate = _.debounce(($target) => {
            let itemId = $target.data('cart-itemid'),
                el = $('#qty-' + itemId),
                oldQty = parseInt(el.text()),
                newQty;

            newQty = $target.data('action') === 'inc' ? oldQty + 1 : oldQty - 1;
            el.text(newQty);
            utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
                if (response.status === 'succeed') {
                    this.refreshContent();
                } else {
                    el.text(oldQty);
                    alert(response.errors.join('\n'));
                }
            });
        }, debounceTimeout),
        cartRemoveItem = _.debounce((itemId) => {
            utils.api.cart.itemRemove(itemId, (err, response) => {
                if (response.status === 'succeed') {
                    this.refreshContent();
                } else {
                    alert(response.errors.join('\n'));
                }
            });
        }, debounceTimeout);

        // cart update
        $('body').on('click', '.cart-update', (event) => {
            let $target = $(event.currentTarget);

            // prevent form submission
            event.preventDefault();

            // update cart quantity
            cartUpdate($target);
        });

        $('body').on('click', '.cart-remove', (event) => {
            let itemId = $(event.currentTarget).data('cart-itemid');

            // prevent form submission
            event.preventDefault();

            // remove item from cart
            cartRemoveItem(itemId);
        });

        next();
    }

    refreshContent() {
        utils.api.cart.getContent({render_with: 'cart/content'}, (err, content) => {
            $('[data-cart-content]').html(content);
        });
    }
}
