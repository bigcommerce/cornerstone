import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import Review from '../product/reviews';
import ProductDetails from '../common/product-details';
import { defaultModal, ModalEvents } from './modal';
import 'slick-carousel';
import { setCarouselState, onSlickCarouselChange, onUserCarouselChange } from '../common/carousel';

export default function (context) {
    const modal = defaultModal();

    $('body').on('click', '.quickview', event => {
        event.preventDefault();

        const productId = $(event.currentTarget).data('productId');
        const handleDropdownExpand = ({ currentTarget }) => {
            const $dropdownMenu = $(currentTarget);
            const dropdownBtnHeight = $dropdownMenu.prev().outerHeight();

            $dropdownMenu.css('top', dropdownBtnHeight);

            return modal.$modal.one(ModalEvents.close, () => $dropdownMenu.off('opened.fndtn.dropdown', handleDropdownExpand));
        };

        modal.open({ size: 'large' });

        utils.api.product.getById(productId, { template: 'products/quick-view' }, (err, response) => {
            if (err) return;

            modal.updateContent(response);

            $('#modal .dropdown-menu').on('opened.fndtn.dropdown', handleDropdownExpand);
            modal.$content.find('.productView').addClass('productView--quickView');

            const $carousel = modal.$content.find('[data-slick]');
            if ($carousel.length) {
                $carousel.on('init breakpoint swipe', setCarouselState);
                $carousel.on('click', '.slick-arrow, .slick-dots', setCarouselState);

                $carousel.on('init afterChange', (e, carouselObj) => onSlickCarouselChange(e, carouselObj, context));
                $carousel.on('click', '.slick-arrow, .slick-dots', $carousel, e => onUserCarouselChange(e, context));
                $carousel.on('swipe', (e, carouselObj) => onUserCarouselChange(e, context, carouselObj.$slider));

                if (modal.$modal.hasClass('open')) {
                    $carousel.slick();
                } else {
                    modal.$modal.one(ModalEvents.opened, () => {
                        if ($.contains(document, $carousel[0])) $carousel.slick();
                    });
                }
            }

            /* eslint-disable no-new */
            new Review({ $context: modal.$content });

            return new ProductDetails(modal.$content.find('.quickView'), context);
        });
    });
}
