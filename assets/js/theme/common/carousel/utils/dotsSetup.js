export default ($dots, actualSlide, actualSlideCount, dotLabels) => {
    if (!$dots) return;

    if (actualSlideCount === 1) {
        $dots.css('display', 'none');
        return;
    }

    $dots.css('display', 'block');

    const { dotAriaLabel, activeDotAriaLabel } = dotLabels;

    $dots.children().each((index, dot) => {
        const $dot = $(dot);
        const dotSlideNumber = index + 1;
        const dotAriaLabelComputed = index === actualSlide
            ? `${dotAriaLabel} ${dotSlideNumber}, ${activeDotAriaLabel}`
            : `${dotAriaLabel} ${dotSlideNumber}`;
        $dot.find('button').attr('aria-label', dotAriaLabelComputed);
    });
};
