const focusedCardClass = 'focused-card';
const focusableElementsSelector = '[href], button, input, textarea, select, details, [tabindex]';
const previousCard = {
    $previous: null,
};

const onCardFocus = (event) => {
    const $element = $(event.target);

    const $cardContainer = $element.parents('.card'); 

    const isFocusInCard = $cardContainer.length;

    const { $previous } = previousCard;
    
    if (isFocusInCard) {
        $previous && $previous.removeClass(focusedCardClass); 
        $cardContainer.addClass(focusedCardClass);
        previousCard.$previous = $cardContainer;
        return;
    }

    $previous && $previous.removeClass(focusedCardClass);
};

export default function () {
    const $allFocusableElements = $(focusableElementsSelector); 

    $allFocusableElements.on('focus', onCardFocus);
};
