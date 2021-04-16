export default ({ slideCount, $slides, options: { slidesToShow, slidesToScroll } }) => {
    const lastVisibleIdx = $slides.get().reduce((acc, curr, idx) => {
        if ($(curr).hasClass('slick-active')) return idx;
        return acc;
    }, -1);

    const activeSlideIdx = lastVisibleIdx < slidesToShow
        ? 0
        : Math.ceil((lastVisibleIdx + 1 - slidesToShow) / slidesToScroll);

    let slidesQuantity;
    if (slideCount === 0) {
        slidesQuantity = 0;
    } else if (slideCount <= slidesToShow) {
        slidesQuantity = 1;
    } else slidesQuantity = Math.ceil((slideCount - slidesToShow) / slidesToScroll) + 1;

    // FYI - one slide can contain several card items for product carousel
    return {
        activeSlideIdx,
        slidesQuantity,
    };
};
