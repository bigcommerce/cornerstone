const FOCUSABLE_ELEMENTS_SELECTOR = '[href], button, input, textarea, select, details, [contenteditable="true"], [tabindex]';

export default ($slides) => {
    $slides.each((idx, slide) => {
        const $slide = $(slide);
        const tabIndex = $slide.hasClass('slick-active') ? 0 : -1;

        if ($slide.is(FOCUSABLE_ELEMENTS_SELECTOR)) $slide.attr('tabindex', tabIndex);

        $slide.find(FOCUSABLE_ELEMENTS_SELECTOR).each((index, child) => {
            $(child).attr('tabindex', tabIndex);
        });
    });
};
