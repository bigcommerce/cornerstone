import getActiveSlideInfo from './getActiveSlideInfo';

const IMAGE_CLASSES = {
    vertical: 'is-vertical-image-type',
    square: 'is-square-image-type',
};
const IS_ANALYZED_DATA_ATTR = 'image-ratio-analyzed';

const defineAspectRatioClass = (imageAspectRatio) => {
    switch (true) {
    case imageAspectRatio > 0.8 && imageAspectRatio <= 1.2:
        return IMAGE_CLASSES.square;
    case imageAspectRatio > 1.2:
        return IMAGE_CLASSES.vertical;
    default:
        return '';
    }
};

const setAspectRatioClass = (imageNode, $slides) => {
    if (imageNode.naturalHeight <= 1) return;

    const imageAspectRatio = imageNode.naturalHeight / imageNode.naturalWidth;
    $slides.addClass(defineAspectRatioClass(imageAspectRatio));
};

export default ({ delegateTarget }, carouselObj) => {
    const {
        isAnalyzedSlide,
        $activeSlide,
        $activeSlideImg,
        activeSlideImgNode,
        $activeSlideAndClones,
    } = getActiveSlideInfo(carouselObj || delegateTarget.slick, IS_ANALYZED_DATA_ATTR);

    if (isAnalyzedSlide) return;

    $activeSlideAndClones.data(IS_ANALYZED_DATA_ATTR, true);

    if ($activeSlide.find('.heroCarousel-content').length) return;

    if (activeSlideImgNode.complete) {
        if (activeSlideImgNode.naturalHeight === 1) {
            // only base64 image from srcset was loaded
            $activeSlideImg.on('load', () => setAspectRatioClass(activeSlideImgNode, $activeSlideAndClones));
        } else if (activeSlideImgNode.naturalHeight > 1) {
            setAspectRatioClass(activeSlideImgNode, $activeSlideAndClones);
        }
    } else $activeSlideImg.on('load', () => setAspectRatioClass(activeSlideImgNode, $activeSlideAndClones));
};
