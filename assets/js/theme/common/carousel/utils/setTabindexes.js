const allFocusableElementsSelector = '[href], button, input, textarea, select, details, [contenteditable="true"], [tabindex]';

export default ($slides, $prevArrow, $nextArrow, actualSlide, actualSlideCount) => {
    $slides.each((index, element) => {
        const $element = $(element);
        const tabIndex = $element.hasClass('slick-active') ? 0 : -1;
        if ($element.attr('href') !== undefined) {
            $element.attr('tabindex', tabIndex);
        }

        $element.find(allFocusableElementsSelector).each((idx, child) => {
            $(child).attr('tabindex', tabIndex);
        });
    });

    if ($prevArrow.length === 0
        || $nextArrow.length === 0
        || $prevArrow.hasClass('js-hero-prev-arrow')) return;

    $prevArrow.attr('aria-disabled', actualSlide === 0);
    $nextArrow.attr('aria-disabled', actualSlide === actualSlideCount - 1);
};
