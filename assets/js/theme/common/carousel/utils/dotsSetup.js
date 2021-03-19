import updateTextWithLiveData from './updateTextWithLiveData';

export default ($dots, activeSlideIdx, slidesQuantity, { carouselArrowAndDotAriaLabel, carouselActiveDotAriaLabel }) => {
    if (!$dots) return;

    if (slidesQuantity < 2) {
        $dots.css('display', 'none');
        return;
    }

    $dots.css('display', 'block');

    $dots.children().each((idx, dot) => {
        const dotLabelText = updateTextWithLiveData(carouselArrowAndDotAriaLabel, idx + 1, slidesQuantity);
        const dotSlideStatusText = idx === activeSlideIdx ? `, ${carouselActiveDotAriaLabel}` : '';
        const dotAriaLabel = `${dotLabelText}${dotSlideStatusText}`;

        $(dot).find('[data-carousel-dot]').attr('aria-label', dotAriaLabel);
    });
};
