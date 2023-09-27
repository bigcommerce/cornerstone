import 'slick-carousel';

import {
    dotsSetup,
    tooltipSetup,
    setTabindexes,
    arrowAriaLabling,
    heroCarouselSetup,
    getRealSlidesQuantityAndCurrentSlide,
} from './utils';

const onCarouselChange = (event, carousel) => {
    const {
        options: { prevArrow, nextArrow },
        currentSlide,
        slideCount,
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

    const $prevArrow = $slider.find(prevArrow);
    const $nextArrow = $slider.find(nextArrow);

    dotsSetup($dots, actualSlide, actualSlideCount, $slider.data('dots-labels'));
    setTabindexes($slider.find('.slick-slide'), $prevArrow, $nextArrow, actualSlide, actualSlideCount);
    arrowAriaLabling($prevArrow, $nextArrow, actualSlide, actualSlideCount);
    tooltipSetup($prevArrow, $nextArrow, $dots);
};

export default function () {
    const $carouselCollection = $('[data-slick]');

    if ($carouselCollection.length === 0) return;

    $carouselCollection.each((index, carousel) => {
        // getting element using find to pass jest test
        const $carousel = $(document).find(carousel);

        if ($carousel.hasClass('productView-thumbnails')) {
            $carousel.slick();
            return;
        }

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
