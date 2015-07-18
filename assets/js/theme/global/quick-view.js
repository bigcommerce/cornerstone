import $ from 'jquery';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.dropdown';
import 'foundation/js/foundation/foundation.reveal';
import product from '../common/product';
import utils from 'bigcommerce/stencil-utils';
import imageGallery from '../product/image-gallery';

export default function () {
    let $modal = $('#modal'),
        $modalContent = $('.modal-content', $modal),
        $modalOverlay = $('.loadingOverlay', $modal),
        modalModifierClasses = 'modal--large';

    // init shared product functionality
    new product();

    $('body').on('click', '.quickview', (event) => {
        let productId = $(event.currentTarget).data('product-id');

        event.preventDefault();

        // The quickview modal is larger than our default modal.
        // Use the modal--large modifier.
        $modal.addClass(modalModifierClasses);

        // clear the modal
        $modalContent.html('');
        $modalOverlay.show();

        // open modal
        $modal.foundation('reveal', 'open');

        utils.api.product.getById(productId, {template: 'products/quick-view'}, (err, response) => {
            $modalOverlay.hide();
            $modalContent.html(response);
            $modalContent.find('.productView').addClass('productView--quickView');
            setNewImageGallery();
        });
    });

    $modal.on('close.fndtn.reveal', (event) => {
        $modal.removeClass(modalModifierClasses);
    });

    function setNewImageGallery() {
        new imageGallery($modalContent.find('[data-image-gallery]'));
    };
}
