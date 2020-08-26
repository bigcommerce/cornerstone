import 'slick-carousel';

const integerRegExp = /[0-9]+/;

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
        }
    };
};

const arrowAriaLabling = ($arrowLeft, $arrowRight, currentSlide, lastSlide) => {
    if (lastSlide < 2) return;
    if ($arrowLeft.length === 0 || $arrowRight.length === 0) return;

    const arrowAriaLabelBaseText = $arrowLeft.attr('aria-label');

    const isInit = arrowAriaLabelBaseText.includes(['NUMBER']);
    const valueToReplace = isInit ? '[NUMBER]' : integerRegExp;

    const leftGoToNumber = currentSlide === 1 ? lastSlide : currentSlide - 1;
    const arrowLeftText = arrowAriaLabelBaseText.replace(valueToReplace, leftGoToNumber);
    $arrowLeft.attr('aria-label', arrowLeftText);

    const rightGoToNumber = currentSlide === lastSlide ? 1 : currentSlide + 1;
    const arrowRightText = arrowAriaLabelBaseText.replace(valueToReplace, `${rightGoToNumber}`);
    $arrowRight.attr('aria-label', arrowRightText);
};

const onCarouselChange = (event, carousel) => {
    const { options: { prevArrow, nextArrow }, currentSlide, slideCount } = carousel;

    setSlideTabindexes($(event.target).find('.slick-slide'));

    arrowAriaLabling($(prevArrow), $(nextArrow), currentSlide + 1, slideCount);
};

export default function () {
    const $carouselCollection = $('[data-slick]');

    if ($carouselCollection.length === 0) return;

    $carouselCollection.on('init', onCarouselChange);
    $carouselCollection.on('afterChange', onCarouselChange);

    $carouselCollection.each((index, carousel) => {
        // getting element using find to pass jest test
        const $carousel = $(document).find(carousel);

        const isMultipleSlides = $carousel.children().length > 1;
        const customPaging = isMultipleSlides
            ? () => (
                '<button type="button"></button>'
            )
            : () => {};

        const options = {
            accessibility: false,
            arrows: isMultipleSlides,
            customPaging,
            dots: isMultipleSlides,
        };

        $carousel.slick(options);
    });

    const $heroCarousel = $carouselCollection.filter('.heroCarousel');
    const $slidesNodes = $heroCarousel.find('.heroCarousel-slide');
    const showCarouselIfSlidesAnalized = showCarouselIfSlidesAnalizedSetup($heroCarousel)($slidesNodes);

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
