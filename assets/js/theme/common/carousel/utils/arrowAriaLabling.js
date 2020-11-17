const NUMBER = '[NUMBER]';
const integerRegExp = /[0-9]+/;
const lastIntegerRegExp = /(\d+)(?!.*\d)/;

export default ($prevArrow, $nextArrow, actualSlide, actualSlideCount) => {
    if (actualSlideCount < 2) return;
    if ($prevArrow.length === 0 || $nextArrow.length === 0) return;

    const arrowAriaLabelBaseText = $prevArrow.attr('aria-label');

    const isInit = arrowAriaLabelBaseText.includes(NUMBER);
    const valueToReplace = isInit ? NUMBER : integerRegExp;
    const currentSlideNumber = actualSlide + 1;

    const prevSlideNumber = actualSlide === 0 ? actualSlideCount : currentSlideNumber - 1;
    const arrowLeftText = arrowAriaLabelBaseText
        .replace(valueToReplace, prevSlideNumber)
        .replace(lastIntegerRegExp, actualSlideCount);
    $prevArrow.attr('aria-label', arrowLeftText);

    const nextSlideNumber = actualSlide === actualSlideCount - 1 ? 1 : currentSlideNumber + 1;
    const arrowRightText = arrowAriaLabelBaseText
        .replace(valueToReplace, nextSlideNumber)
        .replace(lastIntegerRegExp, actualSlideCount);
    $nextArrow.attr('aria-label', arrowRightText);
};
