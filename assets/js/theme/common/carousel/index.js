import 'slick-carousel';

import {
    dotsSetup,
    tooltipSetup,
    setTabindexes,
    arrowAriaLabling,
    heroCarouselSetup,
    getRealSlidesQuantityAndCurrentSlide,
} from './utils';

export const onCarouselChange = (event, carousel) => {
    const {
        options: { prevArrow, nextArrow },
        currentSlide,
        slideCount,
        $prevArrow,
        $nextArrow,
        $dots,
        $slider,
        breakpointSettings,
        activeBreakpoint,
    } = carousel;

    const { actualSlideCount, actualSlide } = getRealSlidesQuantityAndCurrentSlide(
        breakpointSettings,
        activeBreakpoint,
        currentSlide,
        slideCount,
        $slider.data('slick').slidesToScroll,
    );

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

        $carousel.on('init', onCarouselChange);
        $carousel.on('afterChange', onCarouselChange);

        const isMultipleSlides = $carousel.children().length > 1;
        const customPaging = isMultipleSlides
            ? () => (
                '<button type="button"></button>'
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
