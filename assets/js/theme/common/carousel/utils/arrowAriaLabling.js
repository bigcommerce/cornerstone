import updateTextWithLiveData from './updateTextWithLiveData';

export default ($prevArrow, $nextArrow, actualSlide, actualSlideCount) => {
    if (actualSlideCount < 2) return;
    if ($prevArrow.length === 0 || $nextArrow.length === 0) return;

    const arrowAriaLabelBaseText = $prevArrow.attr('aria-label');
    const currentSlideNumber = actualSlide + 1;

    const prevSlideNumber = actualSlide === 0 ? actualSlideCount : currentSlideNumber - 1;
    const arrowLeftText = updateTextWithLiveData(arrowAriaLabelBaseText, prevSlideNumber, actualSlideCount);

    $prevArrow.attr('aria-label', arrowLeftText);

    const nextSlideNumber = actualSlide === actualSlideCount - 1 ? 1 : currentSlideNumber + 1;
    const arrowRightText = updateTextWithLiveData(arrowAriaLabelBaseText, nextSlideNumber, actualSlideCount);

    $nextArrow.attr('aria-label', arrowRightText);
};
