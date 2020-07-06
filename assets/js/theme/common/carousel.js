import 'slick-carousel';

const showCarouselIfSlidesAnalizedSetup = ($carousel) => {
    const analizedSlides = [];
    return ($slides) => ($slide) => {
        analizedSlides.push($slide);
        return $slides.length === analizedSlides.length
            && $carousel.addClass('is-visible');
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
        $('<img/>')
            .attr('src', $($image).attr('src'))
            .load(function getImageSizes() {
                const imageRealWidth = this.width;
                const imageRealHeight = this.height;

                const imageAspectRatio = imageRealHeight / imageRealWidth;

                $element.addClass(() => {
                    switch (true) {
                    case imageAspectRatio > 0.8 && imageAspectRatio <= 1.2:
                        return 'is-square-image-type';
                    case imageAspectRatio > 1.2:
                        return 'is-vertical-image-type';
                    default:
                        return '';
                    }
                });

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
