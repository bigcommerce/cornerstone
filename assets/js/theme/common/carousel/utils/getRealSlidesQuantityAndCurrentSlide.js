export default (
    breakpointSettings,
    activeBreakpoint,
    currentSlide,
    slideCount,
    defaultSlidesToScrollQuantity = 1,
) => {
    const slidesToScrollQuantity = activeBreakpoint
        /* eslint-disable dot-notation */
        ? breakpointSettings[activeBreakpoint]['slidesToScroll']
        : defaultSlidesToScrollQuantity;

    return {
        actualSlideCount: Math.ceil(slideCount / slidesToScrollQuantity),
        actualSlide: Math.ceil(currentSlide / slidesToScrollQuantity),
    };
};
