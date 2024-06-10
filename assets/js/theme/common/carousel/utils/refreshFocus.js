import { FOCUSABLE_ELEMENTS_SELECTOR } from '../constants';

export default ($prevArrow, $nextArrow, $dots, $slider, activeSlideIdx, slidesQuantity, isInfinite) => {
    if (isInfinite || !$prevArrow || !$nextArrow) return;

    if (activeSlideIdx === 0 && $prevArrow.is(':focus')) {
        $nextArrow.trigger('focus');
    } else if (activeSlideIdx === slidesQuantity - 1 && $nextArrow.is(':focus')) {
        if ($dots) {
            $dots.children().first().find('[data-carousel-dot]').trigger('focus');
            return;
        }

        const $firstActiveSlide = $slider.find('.slick-active').first();

        if ($firstActiveSlide.is(FOCUSABLE_ELEMENTS_SELECTOR)) {
            $firstActiveSlide.trigger('focus');
        } else $firstActiveSlide.find(FOCUSABLE_ELEMENTS_SELECTOR).first().trigger('focus');
    }
};
