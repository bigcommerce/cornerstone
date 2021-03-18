import 'slick-carousel';

import {
    activatePlayPauseButton,
    arrowAriaLabling,
    dotsSetup,
    getActiveSlideIdxAndSlidesQuantity,
    handleImageAspectRatio,
    handleImageLoad,
    setTabindexes,
    tooltipSetup,
    updateTextWithLiveData,
} from './utils';

/**
 * returns activeSlideIdx and slidesQuantity
 * based on provided carousel settings
 * @param {Object} $slickSettings
 * @returns {Object}
 */
const extractSlidesDetails = ({
    slideCount, $slides, options: { slidesToShow, slidesToScroll },
}) => getActiveSlideIdxAndSlidesQuantity(
    slideCount,
    slidesToShow,
    slidesToScroll,
    $slides,
);

export const onUserCarouselChange = ({ data }, context, $slider) => {
    const $activeSlider = $slider || data;
    const $parentContainer = $activeSlider.hasClass('productView-thumbnails') ? $('.productView-images') : $activeSlider;
    const { activeSlideIdx, slidesQuantity } = extractSlidesDetails($activeSlider[0].slick);
    const $carouselContentElement = $('[data-carousel-content-change-message]', $parentContainer);
    const carouselContentAnnounceMessage = updateTextWithLiveData(context.carouselContentAnnounceMessage, (activeSlideIdx + 1), slidesQuantity);

    $carouselContentElement.text(carouselContentAnnounceMessage);
};

export const onSlickCarouselChange = (e, carousel, context) => {
    const {
        $dots,
        $slider,
        $prevArrow,
        $nextArrow,
    } = carousel;

    const { activeSlideIdx, slidesQuantity } = extractSlidesDetails(carousel);

    dotsSetup($dots, activeSlideIdx, slidesQuantity, context);
    arrowAriaLabling($prevArrow, $nextArrow, activeSlideIdx, slidesQuantity, context.carouselArrowAndDotAriaLabel);
    setTabindexes($slider.find('.slick-slide'));
    tooltipSetup($prevArrow, $nextArrow, $dots);
    activatePlayPauseButton(carousel, slidesQuantity, context);
};

export default function (context) {
    $('[data-slick]').each((idx, carousel) => {
        // getting element using find to pass jest test
        const $carousel = $(document).find(carousel);
        $carousel.on('init afterChange', (e, carouselObj) => onSlickCarouselChange(e, carouselObj, context));
        $carousel.on('click', '.slick-arrow, .slick-dots', $carousel, e => onUserCarouselChange(e, context));
        $carousel.on('swipe', (e, carouselObj) => onUserCarouselChange(e, context, carouselObj.$slider));

        if ($carousel.hasClass('heroCarousel')) {
            $carousel.on('init afterChange', handleImageLoad);
            $carousel.on('swipe', handleImageAspectRatio);
            $carousel.on('click', '.slick-arrow, .slick-dots', $carousel, handleImageAspectRatio);

            // Alternative image styling for IE, which doesn't support objectfit
            if (typeof document.documentElement.style.objectFit === 'undefined') {
                $carousel.find('.heroCarousel-slide').each((index, slide) => {
                    $(slide).addClass('compat-object-fit');
                });
            }
        }

        const isMultipleSlides = $carousel.children().length > 1;
        const customPaging = isMultipleSlides
            ? () => (
                '<button data-carousel-dot type="button"></button>'
            )
            : () => {};

        $carousel.slick({
            accessibility: false,
            arrows: isMultipleSlides,
            customPaging,
            dots: isMultipleSlides,
        });
    });
}
