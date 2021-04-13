export default ({ $slider }, isAnalyzedDataAttr) => {
    const $activeSlide = $slider.find('.slick-current');
    const isAnalyzedSlide = $activeSlide.data(isAnalyzedDataAttr);

    if (isAnalyzedSlide) return { isAnalyzedSlide };

    const $activeSlideImg = $activeSlide.find('.heroCarousel-image');
    const activeSlideImgNode = $activeSlideImg[0];

    return {
        $slider,
        $activeSlide,
        $activeSlideImg,
        activeSlideImgNode,
    };
};
