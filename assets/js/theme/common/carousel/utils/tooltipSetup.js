const TOOLTIP_DATA_SELECTOR = 'data-carousel-tooltip';
const TOOLTIP_CLASS = 'carousel-tooltip';
const TOOLTIP_NODE = `<span ${TOOLTIP_DATA_SELECTOR} class="${TOOLTIP_CLASS}"></span>`;

const setupTooltipAriaLabel = ($node) => {
    const $existedTooltip = $node.find(`[${TOOLTIP_DATA_SELECTOR}]`);
    if ($existedTooltip.length) {
        $existedTooltip.attr('aria-label', $node.attr('aria-label'));
    } else {
        const $tooltip = $(TOOLTIP_NODE).attr('aria-label', $node.attr('aria-label'));
        $node.append($tooltip);
    }
};

const setupArrowTooltips = (...arrowNodes) => {
    arrowNodes.forEach($arrow => setupTooltipAriaLabel($arrow));
};

const setupDotTooltips = ($dots) => {
    $dots.children().each((idx, dot) => setupTooltipAriaLabel($('[data-carousel-dot]', dot)));
};

export default ($prevArrow, $nextArrow, $dots) => {
    if ($prevArrow && $nextArrow) {
        setupArrowTooltips($prevArrow, $nextArrow);
    }

    if ($dots) {
        setupDotTooltips($dots);
    }
};
