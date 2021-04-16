import updateTextWithLiveData from './updateTextWithLiveData';
import tooltipSetup from './tooltipSetup';

export default ($prevArrow, $nextArrow, activeSlideIdx, slidesQuantity, isInfinite, ariaLabel) => {
    if (slidesQuantity < 2 || !$prevArrow || !$nextArrow) return;

    const activeSlideNumber = activeSlideIdx + 1;

    const prevSlideNumber = activeSlideIdx === 0 ? slidesQuantity : activeSlideNumber - 1;
    const arrowLeftText = updateTextWithLiveData(ariaLabel, prevSlideNumber, slidesQuantity);

    $prevArrow.attr({
        'aria-label': arrowLeftText,
        tabindex: !isInfinite && activeSlideIdx === 0 ? -1 : 0,
    });
    tooltipSetup($prevArrow);

    const nextSlideNumber = activeSlideIdx === slidesQuantity - 1 ? 1 : activeSlideNumber + 1;
    const arrowRightText = updateTextWithLiveData(ariaLabel, nextSlideNumber, slidesQuantity);

    $nextArrow.attr({
        'aria-label': arrowRightText,
        tabindex: !isInfinite && activeSlideIdx === slidesQuantity - 1 ? -1 : 0,
    });
    tooltipSetup($nextArrow);
};
