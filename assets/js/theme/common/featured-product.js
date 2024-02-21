import utils from '@bigcommerce/stencil-utils';
import ProductDetails from './product-details';
import { onSlickCarouselChange, onUserCarouselChange, setCarouselState } from './carousel';

export default function loadProductById(context) {
    const featuredProductBlocks = $('.mwn-block[data-product-id]');

    if (featuredProductBlocks.length > 0) {
        const headerHeight = $('.header').height();
        let hasInitialized = false;

        $(window).on('load scroll', (() => {
            let hasScrolledHeader = false;

            if (hasInitialized) {
                return;
            }

            if ($(window).scrollTop() > headerHeight) {
                hasScrolledHeader = true;
            }

            if (hasScrolledHeader) {
                featuredProductBlocks.each(((_index, element) => {
                    const container = $(element).find('.mwn-featured-product');
                    const productId = $(element).data('product-id');

                    // Load product
                    utils.api.product.getById(productId, { template: 'products/quick-view-2' }, (err, response) => {
                        if (err) return;

                        container.html(response);
                        container.parents('.mwn-block[data-product-id]').find('.loadingOverlay').remove();
                        const $carousel = container.find('[data-slick]');
                        if ($carousel.length) {
                            $carousel.on('init breakpoint swipe', setCarouselState);
                            $carousel.on('click', '.slick-arrow, .slick-dots', setCarouselState);
                            $carousel.on('init afterChange', (e, carouselObj) => onSlickCarouselChange(e, carouselObj, context));
                            $carousel.on('click', '.slick-arrow, .slick-dots', $carousel, e => onUserCarouselChange(e, context));
                            $carousel.on('swipe', (e, carouselObj) => onUserCarouselChange(e, context, carouselObj.$slider));
                            $carousel.slick();
                        }

                        const productDetails = new ProductDetails($('.productView'), context);
                        productDetails.setProductVariant();
                    });
                }));

                hasInitialized = true;
            }
        }));
    }
}
