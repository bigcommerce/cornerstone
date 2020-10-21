import 'slick-carousel';

const integerRegExp = /[0-9]+/;
const allFocusableElementsSelector = '[href], button, input, textarea, select, details, [contenteditable="true"], [tabindex]';

const setSlideTabindexes = ($slides) => {
    $slides.each((index, element) => {
        const $element = $(element);
        const tabIndex = $element.hasClass('slick-active') ? 0 : -1;
        if (!$element.hasClass('js-product-slide')) {
            $element.attr('tabindex', tabIndex);
        }

        $element.find(allFocusableElementsSelector).each((idx, child) => {
            $(child).attr('tabindex', tabIndex);
        });
    });
};

const showCarouselIfSlidesAnalyzedSetup = ($carousel) => {
    const analyzedSlides = [];
    return ($slides) => ($slide) => {
        analyzedSlides.push($slide);
        if ($slides.length === analyzedSlides.length) {
            $carousel.addClass('is-visible');
        }
    };
};

const arrowAriaLabling = ($arrowLeft, $arrowRight, currentSlide, lastSlide) => {
    if (lastSlide < 2) return;
    if ($arrowLeft.length === 0 || $arrowRight.length === 0) return;

    const arrowAriaLabelBaseText = $arrowLeft.attr('aria-label');

    const isInit = arrowAriaLabelBaseText.includes('[NUMBER]');
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
    const $target = $(event.target);

    setSlideTabindexes($target.find('.slick-slide'));
    arrowAriaLabling($target.find(prevArrow), $target.find(nextArrow), currentSlide + 1, slideCount);
};

export default function () {
    const $carouselCollection = $('[data-slick]');

    if ($carouselCollection.length === 0) return;

    $carouselCollection.each((index, carousel) => {
        // getting element using find to pass jest test
        const $carousel = $(document).find(carousel);

        if ($carousel.hasClass('productView-thumbnails')) {
            $carousel.slick();
            return;
        }

        $carousel.on('init', onCarouselChange);
        $carousel.on('afterChange', onCarouselChange);

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
}
