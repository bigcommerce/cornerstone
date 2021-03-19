export default ({ $slider }, isAnalyzedDataAttr) => {
    const $activeSlide = $slider.find('.slick-current');
    const isAnalyzedSlide = $activeSlide.data(isAnalyzedDataAttr);

    if (isAnalyzedSlide) return { isAnalyzedSlide };

    const $activeSlideImg = $activeSlide.find('.heroCarousel-image');

    const attrsObj = {
        src: $activeSlideImg.attr('src'),
        srcset: $activeSlideImg.attr('srcset'),
        sizes: $activeSlideImg.attr('sizes'),
    };

    return {
        attrsObj,
        $slider,
        $activeSlide,
    };
};
