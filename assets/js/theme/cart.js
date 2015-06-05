import PageManager from '../page-manager';
import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';

export default class Cart extends PageManager {
    loaded(next) {

        // cart update
        $('body').on('click', '.cart-update', (event) => {
            let $target = $(event.currentTarget),
                itemId = $target.data('cart-itemid'),
                el = $('#qty-' + itemId),
                oldQty = parseInt(el.text()),
                newQty;

            event.preventDefault();

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
        });

        $('body').on('click', '.cart-remove', (event) => {
            let itemId = $(event.currentTarget).data('cart-itemid');

            event.preventDefault();

            utils.api.cart.itemRemove(itemId, (err, response) => {
                if (response.status === 'succeed') {
                    this.refreshContent();
                } else {
                    alert(response.errors.join('\n'));
                }
            });
        });

        next();
    }

    refreshContent() {
        let options = {
            template: 'cart/content'
        };

        utils.api.cart.getContent(options, (err, response) => {
            $('[data-cart-content]').html(response.content);
        });
    }
}
