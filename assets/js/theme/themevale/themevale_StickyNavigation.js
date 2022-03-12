import $ from 'jquery';

export default function (context) {
    function header_sticky() {
        // Add class fixed for menu when scroll
        let header_position; const
header_height = $('.header').height();

        if ($(window).width() > 1024) {
            if ($('.header').hasClass('themevale-header-layout-2')) {
                header_position = $('#menu').offset();
            } else {
                header_position = $('.themevale_header').offset();
            }
            header_scroll(header_position.top, header_height);
        } else {
            header_position = $('.themevale-header-Mobile').offset();
            header_scroll(header_position.top, header_height);
        }
    }
   header_sticky();

    function header_scroll(header_position, header_height) {
        $(window).on('scroll', (event) => {
            const scroll = $(window).scrollTop();

            if (scroll > header_position) {
                if (context.themeSettings.themevale_stickyHeader) {
                    $('.header').addClass('is-sticky');
                    if ($('.header').hasClass('themevale-header-layout-2')) {
                        var header_scroll = $('.navPages-container .navPages').height();
                    } else if ($('header').hasClass('is-sticky')) {
                            var header_scroll = $('.themevale_header').height();
                        } else {
                            var header_scroll = $('.themevale-header-PC').height();
                        }
                } else {
                    var header_scroll = 0;
                }

                $('.themevale_dropdown').css('top', header_scroll);
                $('#sticky_addtocart').css('top', header_scroll);

                if ($('.header').hasClass('themevale-header-layout-2')) {
                   const heightNav = $('.navPages-container .navPages').height();
                   $('.themevale_header .header-right').css('min-height',heightNav);
                }

                // Margin Top Home Slideshow For Layout 2
                if ($(window).width() > 1024) {
                    if ($('.header').hasClass('themevale-header-layout-2')) {
                        var height = $('.navPages-container .navPages').height();
                        var top = 0 - height;
                        $('.heroCarousel').css('margin-top', top);
                     }
                }
            } else {
                $('.header').removeClass('is-sticky');

                $('.themevale_dropdown').css('top', header_height);
                $('.themevale_header .header-right').css('min-height',"0");
                $('#sticky_addtocart').css('top', header_height);
                if ($(window).width() > 1024) {
                    if ($('.header').hasClass('themevale-header-layout-2')) {
                        var height = $('.themevale_header').height() + $('.navPages-container .navPages').height();
                        var top = 0 - height;
                        $('.heroCarousel').css('margin-top', top);
                    }
                }
            }
        });

        window.onload = function () {
            $('.themevale_dropdown').css('top', header_scroll);
            if ($(window).scrollTop() > header_position) {
                if (context.themeSettings.themevale_stickyHeader) {
                    $('.header').addClass('is-sticky');
                }

                if ($('.header').hasClass('themevale-header-layout-2')) {
                    var header_scroll = $('.navPages-container .navPages').height();
                } else if ($('.header').hasClass('is-sticky')) {
                        var header_scroll = $('.themevale-header-PC').height();
                    } else {
                        var header_scroll = $('.themevale_header').height();
                    }
                $('.themevale_dropdown').css('top', header_scroll);
                if ($('.header').hasClass('is-sticky')) {
                    $('#sticky_addtocart').css('top', header_scroll);
                } else {
                    $('#sticky_addtocart').css('top', '0px');
                }

                if ($('.header').hasClass('themevale-header-layout-2')) {
                   const heightNav = $('.navPages-container .navPages').height();
                   $('.themevale_header .header-right').css('min-height',heightNav);
                }
            } else {
                $('.header').removeClass('is-sticky');
            }
        };
    }
}
