import { isBrowserIE } from '../../utils/ie-helpers';
import getActiveSlideInfo from './getActiveSlideInfo';

const IMAGE_ERROR_CLASS = 'is-image-error';
const IS_ANALYZED_DATA_ATTR = 'image-load-analyzed';

const generateImage = ($slide, $image) => {
    $('<img />')
        .on('error', () => $slide.addClass(IMAGE_ERROR_CLASS))
        .attr('src', $image.attr('src'));
};

export default (e, carouselObj) => {
    const {
        isAnalyzedSlide,
        $activeSlide,
        $activeSlideImg,
        activeSlideImgNode,
    } = getActiveSlideInfo(carouselObj, IS_ANALYZED_DATA_ATTR);

    if (isAnalyzedSlide) return;

    $activeSlide.data(IS_ANALYZED_DATA_ATTR, true);

    if (activeSlideImgNode.complete) {
        if (activeSlideImgNode.naturalHeight === 0) {
            $activeSlide.addClass(IMAGE_ERROR_CLASS);
        } else if (activeSlideImgNode.naturalHeight === 1) {
            // only base64 image from srcset was loaded
            $activeSlideImg.on('error', () => $activeSlide.addClass(IMAGE_ERROR_CLASS));
        }

        return;
    }

    if (!$activeSlideImg.attr('src')) {
        $activeSlide.addClass(IMAGE_ERROR_CLASS);
        return;
    }

    if (isBrowserIE) {
        generateImage($activeSlide, $activeSlideImg);
        return;
    }

    $activeSlideImg.on('error', () => $activeSlide.addClass(IMAGE_ERROR_CLASS));
};
