import 'slick-carousel';

const showCarouselIfSlidesAnalizedSetup = ($carousel) => {
    const analizedSlides = [];
    return ($slides) => ($slide) => {
        analizedSlides.push($slide);
        return $slides.length === analizedSlides.length && $carousel.addClass('is-visible');
    };
};

export default function () {
    const $carousel = $('[data-slick]');

    if ($carousel.length === 0) return;

    $carousel.slick({ dots: $carousel[0].childElementCount > 1 });

    const $slidesNodes = $('.heroCarousel-slide');

    const showCarouselIfSlidesAnalized = showCarouselIfSlidesAnalizedSetup($carousel)($slidesNodes);

    $slidesNodes.each((index, element) => {
        const $element = $(element);
        const isContentBlock = !!$element.find('.heroCarousel-content').length;

        if (isContentBlock) {
            showCarouselIfSlidesAnalized($element);
            return true;
        }

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
                showCarouselIfSlidesAnalized($element);
            });
    });

    // Alternative image styling for IE, which doesn't support objectfit
    if (document.documentElement.style.objectFit === undefined) {
        $slidesNodes.each((index, element) => {
            $(element).addClass('compat-object-fit');
        });
    }
}
