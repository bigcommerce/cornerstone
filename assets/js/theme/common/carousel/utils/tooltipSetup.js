const carouselTooltipClass = 'carousel-tooltip';
const carouselTooltip = `<span class="${carouselTooltipClass}"></span>`;

const setupTooltipAriaLabel = ($node) => {
    const $existedTooltip = $node.find(`.${carouselTooltipClass}`);

    if ($existedTooltip.length) {
        $existedTooltip.attr('aria-label', $node.attr('aria-label'));
    } else {
        const $tooltip = $(carouselTooltip).attr('aria-label', $node.attr('aria-label'));
        $node.append($tooltip);
    }
};

const setupArrowTooltips = (...arrowNodes) => {
    arrowNodes.forEach($arrow => setupTooltipAriaLabel($arrow));
};

const setupDotTooltips = ($dots) => {
    $dots.children().each((idx, dot) => setupTooltipAriaLabel($(dot).find('button')));
};

export default ($prevArrow, $nextArrow, $dots) => {
    if ($prevArrow.length && $nextArrow.length) {
        setupArrowTooltips($prevArrow, $nextArrow);
    }
    if ($dots) {
        setupDotTooltips($dots);
    }
};
