import PageManager from '../page-manager';
import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';

export default class Cart extends PageManager {
    constructor() {
        super();

        utils.events.on('cart-item-update', (event, button) => {
            let itemId = $(button).data('cart-update'),
                el = $('#qty-' + itemId),
                oldQty = parseInt(el.text()),
                newQty;

            event.preventDefault();

            newQty = $(button).data('action') === 'inc' ? oldQty + 1 : oldQty - 1;
            el.text(newQty);
        
            utils.remote.cart.cartItemUpdate(itemId, newQty, (err, response) => {
                if (response.status === 'succeed') {
                    this.refreshCartContent();
                } else {
                    el.text(oldQty);
                    alert(response.errors.join('\n'));
                }
            });         
        });

        utils.events.on('cart-item-remove', (event, el) => {
            let itemId = $(el).data('cart-remove');

            event.preventDefault();

            utils.remote.cart.cartItemRemove(itemId, (err, response) => {
                if (response.status === 'succeed') {
                    this.refreshCartContent();
                } else {
                    alert(response.errors.join('\n'));
                }
            });        
        });
    }

    refreshCartContent() {
        utils.remote.cart.cartContent({render_with: 'cart/content'}, (err, content) => {
            $('[data-cart-content]').html(content);
        });
    }
}
