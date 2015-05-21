import utils from 'bigcommerce/stencil-utils';
import $ from 'jquery';
import Modal from './modal';

export default function () {
    $('body').on('click', 'button[data-quick-view]', (event) => {
        let target = $(event.target),
            productId = target.data('product-id');

        console.log("loading product id " + productId);

        utils.product.getById(productId, {render_with: 'products/quick'}, function(err, rendered) {

            Modal.open(rendered);
        });


        return false;
    });
};

