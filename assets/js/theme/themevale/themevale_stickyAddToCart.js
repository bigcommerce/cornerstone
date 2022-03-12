import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import swal from 'sweetalert2';
import _ from 'lodash';

export default function () {
    const scroll = $('#form-action-addToCart').offset();
    let scrollTop = scroll.top;
    if ($('.productView-info-name.fbt').length) {
        scrollTop += 280;
    } else {
        scrollTop -= 80;
    }

    $(window).scroll(() => {
        if ($(window).scrollTop() > scrollTop) {
            if (!$('#sticky_addtocart').hasClass('show_sticky')) {
                $('#sticky_addtocart').addClass('show_sticky');
            }
        } else {
            $('#sticky_addtocart').removeClass('show_sticky');
            $('.pop-up-option').removeClass('is-open');
            $('.choose_options_add').removeClass('is-active');
        }
    });

    $(document).on('click','.choose_options_add', function (event) {
        $(this).toggleClass('is-active');
        $('.pop-up-option').toggleClass('is-open');
    });

    $(document).on('click','.pop-up-option .close', (event) => {
        $(".pop-up-option").removeClass('is-open');
        $('.choose_options_add').removeClass('is-active');
    });

    window.onload = function () {
        if ($(window).scrollTop() > scrollTop) {
            if (!$('#sticky_addtocart').hasClass('show_sticky')) {
                $('#sticky_addtocart').addClass('show_sticky');
                if ($('.header').hasClass('is-sticky')) {
                    $('#sticky_addtocart').css('top', header_scroll);
                } else {
                    $('#sticky_addtocart').css('top', '0px');
                }
            }
        }
    };
}
