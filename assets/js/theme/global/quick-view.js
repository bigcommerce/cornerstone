import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import 'foundation/js/foundation/foundation.reveal';
import utils from 'bigcommerce/stencil-utils';

export default function () {
    let $modal = $('#modal'),
        $modalContent = $('.modal-content', $modal),
        $modalOverlay = $('.loadingOverlay', $modal);

    $('.quickview').on('click', (event) => {
        let productId = $(event.currentTarget).data('product-id');

        event.preventDefault();

        // clear the modal
        $modalContent.html('');
        $modalOverlay.show();

        // open modal
        $modal.foundation('reveal', 'open');

        utils.api.product.getById(productId, {template: 'products/quick-view'}, (err, response) => {
            $modalOverlay.hide();
            $modalContent.html(response);
        });
    });
}
