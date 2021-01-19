import playPause from './playPause';

const showCarouselIfSlidesAnalyzedSetup = ($carousel) => {
    const analyzedSlides = [];
    return ($slides) => ($slide) => {
        analyzedSlides.push($slide);
        if ($slides.length === analyzedSlides.length) {
            $carousel.addClass('is-visible');
        }
    };
};

export default ($heroCarousel) => {
    if ($heroCarousel.length === 0) return;

    playPause($heroCarousel);

    const $slidesNodes = $heroCarousel.find('.heroCarousel-slide');
    const showCarouselIfSlidesAnalyzed = showCarouselIfSlidesAnalyzedSetup($heroCarousel)($slidesNodes);

    $slidesNodes.each((index, element) => {
        const $element = $(element);
        const isContentBlock = !!$element.find('.heroCarousel-content').length;

        if (isContentBlock) {
            showCarouselIfSlidesAnalyzed($element);
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

                showCarouselIfSlidesAnalyzed($element);
            })
            .error(() => {
                showCarouselIfSlidesAnalyzed($element);
            });
    });

    // Alternative image styling for IE, which doesn't support objectfit
    if (document.documentElement.style.objectFit === undefined) {
        $slidesNodes.each((index, element) => {
            $(element).addClass('compat-object-fit');
        });
    }
};
