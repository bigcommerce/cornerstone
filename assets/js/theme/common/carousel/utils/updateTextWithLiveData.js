const SLIDE_NUMBER = '[SLIDE_NUMBER]';
const SLIDES_QUANTITY = '[SLIDES_QUANTITY]';

export default (textForChange, slideNumber, slidesQuantity) => (
    textForChange
        .replace(SLIDE_NUMBER, slideNumber)
        .replace(SLIDES_QUANTITY, slidesQuantity)
);
