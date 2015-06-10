import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import 'foundation/js/foundation/foundation.reveal';
import utils from 'bigcommerce/stencil-utils';

export default function () {
    let $quickViewModal = $('#quickViewModal'),
        $quickViewModalBody = $('.modal-body', $quickViewModal);

    $('.quickview').on('click', (event) => {
        let productId = $(event.currentTarget).data('product-id');

        event.preventDefault();

        // open modal
        $quickViewModal.foundation('reveal', 'open');

        // listen modal dialog
        $quickViewModal.on('opened.fndtn.reveal', () => {
            utils.api.product.getById(productId, {template: 'products/quick'}, (err, response) => {
                $quickViewModalBody.html(response.content);
            });
        });
    });
}
