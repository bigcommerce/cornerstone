import 'slick-carousel';

import {
    dotsSetup,
    tooltipSetup,
    setTabindexes,
    arrowAriaLabling,
    updateTextWithLiveData,
    heroCarouselSetup,
    getRealSlidesQuantityAndCurrentSlide,
} from './utils';

/**
 * returns actualSlide and actualSlideCount
 * based on provided carousel settings
 * @param {Object} $slickSettings
 * @returns {Object}
 */
const extractSlidesDetails = ({
    slideCount, currentSlide, breakpointSettings, activeBreakpoint, $slider,
}) => getRealSlidesQuantityAndCurrentSlide(
    breakpointSettings,
    activeBreakpoint,
    currentSlide,
    slideCount,
    $slider.data('slick').slidesToScroll,
);

export const onCarouselClick = ({
    data: $activeSlider,
}) => {
    const $parentContainer = $activeSlider.hasClass('productView-thumbnails') ? $('.productView-images') : $activeSlider;
    const { actualSlideCount, actualSlide } = extractSlidesDetails($activeSlider[0].slick);
    const $carouselContentElement = $('.js-carousel-content-change-message', $parentContainer);
    const carouselContentInitText = $carouselContentElement.text();
    const carouselContentAnnounceMessage = updateTextWithLiveData(carouselContentInitText, (actualSlide + 1), actualSlideCount);

    $carouselContentElement.text(carouselContentAnnounceMessage);
};

export const onCarouselChange = (event, carousel) => {
    const {
        options: { prevArrow, nextArrow },
        $prevArrow,
        $nextArrow,
        $dots,
        $slider,
    } = carousel;

    const { actualSlideCount, actualSlide } = extractSlidesDetails(carousel);
    const $prevArrowNode = $prevArrow || $slider.find(prevArrow);
    const $nextArrowNode = $nextArrow || $slider.find(nextArrow);

    const dataArrowLabel = $slider.data('arrow-label');

    if (dataArrowLabel) {
        $prevArrowNode.attr('aria-label', dataArrowLabel);
        $nextArrowNode.attr('aria-label', dataArrowLabel);
        $slider.data('arrow-label', false);
    }

    dotsSetup($dots, actualSlide, actualSlideCount, $slider.data('dots-labels'));
    setTabindexes($slider.find('.slick-slide'), $prevArrowNode, $nextArrowNode, actualSlide, actualSlideCount);
    arrowAriaLabling($prevArrowNode, $nextArrowNode, actualSlide, actualSlideCount);
    tooltipSetup($prevArrowNode, $nextArrowNode, $dots);
};

export default function () {
    const $carouselCollection = $('[data-slick]');

    if ($carouselCollection.length === 0) return;

    $carouselCollection.each((index, carousel) => {
        // getting element using find to pass jest test
        const $carousel = $(document).find(carousel);
        $carousel.on('init afterChange', onCarouselChange);
        $carousel.on('click', '.slick-arrow, .js-carousel-dot', $carousel, onCarouselClick);

        const isMultipleSlides = $carousel.children().length > 1;
        const customPaging = isMultipleSlides
            ? () => (
                '<button class="js-carousel-dot" type="button"></button>'
            )
            : () => {};

        $carousel.slick({
            accessibility: false,
            arrows: isMultipleSlides,
            customPaging,
            dots: isMultipleSlides,
        });
    });

    heroCarouselSetup($carouselCollection.filter('.heroCarousel'));
}
