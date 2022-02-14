import 'slick-carousel';

export default function () {
    const $carousel = $('[data-slick]');
    if ($carousel.length) {
        const multipleSlides = $carousel[0].childElementCount > 1;
        $carousel.slick({ dots: multipleSlides });
    }

    // Alternative image styling for IE, which doesn't support objectfit
    if (typeof document.documentElement.style.objectFit === 'undefined') {
        $('.heroCarousel-slide').each((index, element) => {
            const $container = $(element);
            const imgUrl = $container.find('img').data('lazy');

            if (imgUrl) {
                $container.css('backgroundImage', `url(${imgUrl})`).addClass('compat-object-fit');
            }
        });
    }

    $(".productCarousel").each(function (index) {
        var height = $(this).find('.card .card-figure').height();
        $(this).find('.slick-arrow').css('top', (height / 2));
    });
    if ($(window).width() > 1280) {
        $(".collection-list").each(function (index) {
            var height = $(this).find('.collection-item .collection-image').height();
            $(this).find('.slick-arrow').css('top', (height / 2));
        });
    }
    $(".productCarousel").each(function (index) {
        if ($(this).find('.slick-dots li').length <= 1) {
            $(this).find('.slick-dots').addClass('no-dots');
        }
    });
}
