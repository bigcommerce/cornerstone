import utils from '@bigcommerce/stencil-utils';

export default function loadProductByCategory(productBlockCols, productBlockLimit) {
    const carouselConfig = {
        template: 'products/carousel-2',
    };
    const categoryBlocks = $('.mwn-block[data-category-id]');

    if (categoryBlocks.length > 0) {
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
                categoryBlocks.each(((_index, element) => {
                    const productCarousel = $(element).find('.productCarousel');
                    const categoryId = $(element).data('category-id');
                    const categoryUrl = $(element).data('category-url');

                    // Load products for the category if the product carousel is empty
                    if ($(`#category-product-${categoryId}.productCarousel .productCarousel-slide`).length === 0) {
                        utils.api.getPage(`${categoryUrl}?limit=${productBlockLimit}`, carouselConfig, (_err, responseData) => {
                            productCarousel.html(responseData);

                            // Initialize the product carousel with Slick slider
                            function initializeCarousel(carouselElement) {
                                carouselElement.slick({
                                    dots: true,
                                    arrows: false,
                                    infinite: false,
                                    mobileFirst: true,
                                    slidesToShow: 2,
                                    slidesToScroll: 1,
                                    nextArrow: "<svg class='slick-next slick-arrow slick-arrow-large' aria-label='Next Slide'><use xlink:href=#slick-arrow-next></use></svg>",
                                    prevArrow: "<svg class='slick-prev slick-arrow slick-arrow-large' aria-label='Previous Slide'><use xlink:href=#slick-arrow-prev></use></svg>",
                                    responsive: [{
                                        breakpoint: 1024,
                                        settings: {
                                            arrows: true,
                                            slidesToShow: parseInt(productBlockCols, 10),
                                        },
                                    }, {
                                        breakpoint: 991,
                                        settings: {
                                            slidesToShow: parseInt(productBlockCols, 10) - 1,
                                        },
                                    }, {
                                        breakpoint: 767,
                                        settings: {
                                            slidesToShow: parseInt(productBlockCols, 10) - 2,
                                        },
                                    }],
                                });
                            }

                            initializeCarousel(productCarousel);
                            productCarousel.parents('.mwn-block[data-category-id]').find('.loadingOverlay').remove();
                        });
                    }
                }));

                hasInitialized = true;
            }
        }));
    }
}
