import 'slick-carousel';

export default function () {
    const $carousel = $('[data-slick]');

    if ($carousel.length === 0) return;

    const multipleSlides = $carousel[0].childElementCount > 1;
    $carousel.slick({ dots: multipleSlides });

    const $slidesNodes = $('.heroCarousel-slide');

    $slidesNodes.each((index, element) => {
        const $element = $(element);
        const isContentBlock = !!$element.find('.heroCarousel-content').length;

        if (isContentBlock) return true;

        const $image = $element.find('.heroCarousel-image-wrapper img');
        $('<img/>') // Make in memory copy of image to avoid css issues
            .attr('src', $($image).attr('src'))
            .load(function getImageSizes() {
                const imageRealWidth = this.width; // Note: $(this).width() will not
                const imageRealHeight = this.height; // work for in memory images.

                const imageAspectRatio = imageRealHeight / imageRealWidth;

                const isImageSquare = imageAspectRatio > 0.8 && imageAspectRatio <= 1.2;
                const isImageVertical = imageAspectRatio > 1.2;

                const slideClass = isImageSquare && 'is-square-image-type'
                    || isImageVertical && 'is-vertical-image-type'
                    || '';

                $element.addClass(slideClass);
            });
    });

    // Alternative image styling for IE, which doesn't support objectfit
    if (typeof document.documentElement.style.objectFit === 'undefined') {
        $slidesNodes.each((index, element) => {
            $(element).addClass('compat-object-fit');
        });
    }
}
