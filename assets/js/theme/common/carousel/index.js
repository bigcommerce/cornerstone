import 'slick-carousel';

import {
    activatePlayPauseButton,
    analizeSlides,
    arrowAriaLabling,
    dotsSetup,
    getActiveSlideIdxAndSlidesQuantity,
    handleImageAspectRatio,
    handleImageLoad,
    refreshFocus,
    updateTextWithLiveData,
} from './utils';

export const setCarouselState = ({ delegateTarget }, carouselObj) => {
    const carouselObjCurrent = carouselObj || delegateTarget.slick;
    const { $slider } = carouselObjCurrent;

    $slider.data('state', getActiveSlideIdxAndSlidesQuantity(carouselObjCurrent));
};

export const onUserCarouselChange = ({ data }, context, $slider) => {
    const $activeSlider = $slider || data;
    const $parentContainer = $activeSlider.hasClass('productView-thumbnails') ? $activeSlider.parent('.productView-images') : $activeSlider;
    const { activeSlideIdx, slidesQuantity } = $activeSlider.data('state');
    const $carouselContentElement = $('[data-carousel-content-change-message]', $parentContainer);
    const carouselContentAnnounceMessage = updateTextWithLiveData(context.carouselContentAnnounceMessage, (activeSlideIdx + 1), slidesQuantity);

    $carouselContentElement.text(carouselContentAnnounceMessage);
};

export const onSlickCarouselChange = (e, carouselObj, context) => {
    const {
        $dots,
        $slider,
        $prevArrow,
        $nextArrow,
        options: { infinite },
    } = carouselObj;

    const { activeSlideIdx, slidesQuantity } = $slider.data('state') || getActiveSlideIdxAndSlidesQuantity(carouselObj);

    dotsSetup($dots, activeSlideIdx, slidesQuantity, context);
    arrowAriaLabling($prevArrow, $nextArrow, activeSlideIdx, slidesQuantity, infinite, context.carouselArrowAndDotAriaLabel);
    analizeSlides($slider.find('.slick-slide'));
    refreshFocus($prevArrow, $nextArrow, $dots, $slider, activeSlideIdx, slidesQuantity, infinite);

    $slider.data('state', null);
};

export default function (context) {
    $('[data-slick]').each((idx, carousel) => {
        // getting element using find to pass jest test
        const $carousel = $(document).find(carousel);

        $carousel.on('init breakpoint swipe', setCarouselState);
        $carousel.on('click', '.slick-arrow, .slick-dots', setCarouselState);

        $carousel.on('init breakpoint', (e, carouselObj) => activatePlayPauseButton(e, carouselObj, context));
        $carousel.on('init afterChange', (e, carouselObj) => onSlickCarouselChange(e, carouselObj, context));
        $carousel.on('click', '.slick-arrow, .slick-dots', $carousel, e => onUserCarouselChange(e, context));
        $carousel.on('swipe', (e, carouselObj) => onUserCarouselChange(e, context, carouselObj.$slider));

        if ($carousel.hasClass('heroCarousel')) {
            $carousel.on('init afterChange', handleImageLoad);
            $carousel.on('swipe', handleImageAspectRatio);
            $carousel.on('click', '.slick-arrow, .slick-dots', handleImageAspectRatio);

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
