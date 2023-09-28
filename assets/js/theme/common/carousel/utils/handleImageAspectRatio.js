import getActiveSlideInfo from './getActiveSlideInfo';

const IMAGE_CLASSES = {
    vertical: 'is-vertical-image-type',
    square: 'is-square-image-type',
};
const IS_ANALYZED_DATA_ATTR = 'image-ratio-analyzed';

const defineClass = (imageAspectRatio) => {
    switch (true) {
    case imageAspectRatio > 0.8 && imageAspectRatio <= 1.2:
        return IMAGE_CLASSES.square;
    case imageAspectRatio > 1.2:
        return IMAGE_CLASSES.vertical;
    default:
        return '';
    }
};

export default ({ delegateTarget }, carousel) => {
    const {
        isAnalyzedSlide,
        attrsObj,
        $slider,
        $activeSlide,
    } = getActiveSlideInfo(carousel || delegateTarget.slick, IS_ANALYZED_DATA_ATTR);

    if (isAnalyzedSlide) return;

    const $activeSlideAndClones = $slider.find(`[data-hero-slide=${$activeSlide.data('hero-slide')}]`);
    $activeSlideAndClones.each((idx, slide) => $(slide).data(IS_ANALYZED_DATA_ATTR, true));

    if ($activeSlide.find('.heroCarousel-content').length) return;

    $('<img />')
        .on('load', function getImageSizes() {
            const imageHeight = this.height;
            const imageWidth = this.width;

            if (imageHeight < 2 || imageWidth < 2) return;

            const imageAspectRatio = imageHeight / imageWidth;
            $activeSlideAndClones.each((idx, slide) => $(slide).addClass(defineClass(imageAspectRatio)));
        })
        .attr(attrsObj);
};
