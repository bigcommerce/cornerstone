import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import ProductDetails from '../common/product-details';
import { defaultModal } from './modal';
import 'slick-carousel';
import { onCarouselChange, onCarouselClick } from '../common/carousel';

export default function (context) {
    const modal = defaultModal();

    $('body').on('click', '.quickview', event => {
        event.preventDefault();

        const productId = $(event.currentTarget).data('productId');

        modal.open({ size: 'large' });

        utils.api.product.getById(productId, { template: 'products/quick-view' }, (err, response) => {
            modal.updateContent(response);

            modal.$content.find('.productView').addClass('productView--quickView');

            const $carousel = modal.$content.find('[data-slick]');

            if ($carousel.length) {
                $carousel.on('init afterChange', onCarouselChange);
                $carousel.on('click', '.slick-arrow', $carousel, onCarouselClick);

                $carousel.slick();
            }

            modal.setupFocusTrap();

            return new ProductDetails(modal.$content.find('.quickView'), context);
        });
    });
}
