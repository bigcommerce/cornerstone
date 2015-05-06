import PageManager from '../page-manager';
import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';

export default class Cart extends PageManager {
    constructor() {
        super();

        $(document.body).on('click', '[data-quantity-inc]', (event) => {
            let itemId = $(event.target).attr('data-quantity-inc'),
                el = $('#qty-' + itemId);

            event.preventDefault();
            this.changeQty(el, itemId, parseInt(el.html()) + 1);            
        });

        $(document.body).on('click', '[data-quantity-dec]', (event) => {
            let itemId = $(event.target).attr('data-quantity-dec'),
                el = $('#qty-' + itemId);

            event.preventDefault();
            this.changeQty(el, itemId, parseInt(el.html()) - 1);            
        });
    }

    changeQty(el, itemId, qty) {
        var oldQty = el.html();
        el.html(qty);
        // utils.events.emit('cart-update');
        utils.remote.cart.cartItemUpdate(itemId, qty, (err, response) => {
            console.log(response);
            if (response.status === 'succeed') {
                utils.remote.cart.cartContent({render_with: 'cart/content'}, (err, content) => {
                    $('[data-cart-content]').html(content);
                });
            } else {
                el.html(oldQty);
                alert(response.errors.join('\n'));
            }
        });
    }
}
