import 'slick-carousel';

const setSlideTabindexes = ($slides) => {
    $slides.each((index, element) => {
        const $element = $(element);
        const tabIndex = $element.hasClass('slick-active') ? 0 : -1;
        $element.attr('tabindex', tabIndex);
    });
};

const showCarouselIfSlidesAnalizedSetup = ($carousel) => {
    const analizedSlides = [];
    return ($slides) => ($slide) => {
        analizedSlides.push($slide);
        if ($slides.length === analizedSlides.length) {
            $carousel.addClass('is-visible');
            setSlideTabindexes($('.slick-slide'));
        }
    };
};

export default function () {
    const $carousel = $('[data-slick]');

    if ($carousel.length === 0) return;

    const isMultipleSlides = $carousel[0].childElementCount > 1;

    const slickSettingsObj = isMultipleSlides
        ? {
            dots: true,
            customPaging: () => (
                '<button type="button"></button>'
            ),
        }
        : {
            dots: false,
        };

    $carousel.slick(slickSettingsObj);

    $carousel.on('afterChange', () => {
        setSlideTabindexes($('.slick-slide'));
    });

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
