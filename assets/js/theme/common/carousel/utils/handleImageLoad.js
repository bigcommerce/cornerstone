import { isBrowserIE } from '../../utils/ie-helpers';
import getActiveSlideInfo from './getActiveSlideInfo';

const IMAGE_ERROR_CLASS = 'is-image-error';
const IS_ANALYZED_DATA_ATTR = 'image-load-analyzed';

const generateImage = ($image, $slides) => {
    $('<img />')
        .on('error', () => $slides.addClass(IMAGE_ERROR_CLASS))
        .attr('src', $image.attr('src'));
};

export default (e, carouselObj) => {
    const {
        isAnalyzedSlide,
        $activeSlideImg,
        activeSlideImgNode,
        $activeSlideAndClones,
    } = getActiveSlideInfo(carouselObj, IS_ANALYZED_DATA_ATTR);

    if (isAnalyzedSlide) return;

    $activeSlideAndClones.data(IS_ANALYZED_DATA_ATTR, true);

    if (activeSlideImgNode.complete) {
        if (activeSlideImgNode.naturalHeight === 0) {
            $activeSlideAndClones.addClass(IMAGE_ERROR_CLASS);
        } else if (activeSlideImgNode.naturalHeight === 1) {
            // only base64 image from srcset was loaded
            $activeSlideImg.on('error', () => $activeSlideAndClones.addClass(IMAGE_ERROR_CLASS));
        }

        return;
    }

    if (!$activeSlideImg.attr('src')) {
        $activeSlideAndClones.addClass(IMAGE_ERROR_CLASS);
        return;
    }

    if (isBrowserIE) {
        generateImage($activeSlideImg, $activeSlideAndClones);
        return;
    }

    $activeSlideImg.on('error', () => $activeSlideAndClones.addClass(IMAGE_ERROR_CLASS));
};
