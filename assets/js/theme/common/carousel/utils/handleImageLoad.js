import getActiveSlideInfo from './getActiveSlideInfo';

const IMAGE_ERROR_CLASS = 'is-image-error';
const IS_ANALYZED_DATA_ATTR = 'image-load-analyzed';

export default (e, carousel) => {
    const {
        isAnalyzedSlide,
        attrsObj,
        $activeSlide,
    } = getActiveSlideInfo(carousel, IS_ANALYZED_DATA_ATTR);

    if (isAnalyzedSlide) return;

    $activeSlide.data(IS_ANALYZED_DATA_ATTR, true);

    $('<img />')
        .on('error', () => $activeSlide.addClass(IMAGE_ERROR_CLASS))
        .attr(attrsObj);
};
