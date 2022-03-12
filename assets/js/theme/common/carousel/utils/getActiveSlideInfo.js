export default ({ $slider }, isAnalyzedDataAttr) => {
    const $activeSlide = $slider.find('.slick-current');
    const isAnalyzedSlide = $activeSlide.data(isAnalyzedDataAttr);

    if (isAnalyzedSlide) return { isAnalyzedSlide };

    const $activeSlideImg = $activeSlide.find('.heroCarousel-image');
    const activeSlideImgNode = $activeSlideImg[0];
    const $activeSlideAndClones = $slider.find(`[data-hero-slide=${$activeSlide.data('hero-slide')}]`);

    return {
        $slider,
        $activeSlide,
        $activeSlideImg,
        activeSlideImgNode,
        $activeSlideAndClones,
    };
};
