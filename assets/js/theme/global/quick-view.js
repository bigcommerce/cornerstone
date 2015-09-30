import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import 'foundation/js/foundation/foundation.reveal';
import utils from 'bigcommerce/stencil-utils';
import ProductDetails from '../common/product-details';

export default function(context) {
    const $modal = $('#modal');
    const $modalContent = $('.modal-content', $modal);
    const $modalOverlay = $('.loadingOverlay', $modal);
    const modalModifierClasses = 'modal--large';

    $('body').on('click', '.quickview', (event) => {
        const productId = $(event.currentTarget).data('product-id');

        event.preventDefault();

        // The quickview modal is larger than our default modal.
        // Use the modal--large modifier.
        $modal.addClass(modalModifierClasses);

        // clear the modal
        $modalContent.html('');
        $modalOverlay.show();

        // open modal
        $modal.foundation('reveal', 'open');

        utils.api.product.getById(productId, {template: 'products/quick-view'}, function done(err, response) {
            $modalOverlay.hide();
            $modalContent.html(response);
            $modalContent.find('.productView').addClass('productView--quickView');

            return new ProductDetails($modalContent, context);
        });
    });

    $modal.on('close.fndtn.reveal', () => {
        $modal.removeClass(modalModifierClasses);
    });
}
