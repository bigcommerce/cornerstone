import $ from 'jquery';

export default function() {
    const $mobileMenuTrigger = $('[data-mobilemenu]');
    const $header = $('.header');
    const $mobileMenu = $('#mobile-menu');
    const $mobileMenuScrollView = $mobileMenu.find('.navPages');
    const $body = $('body');

    function toggleHeaderHeight() {
        $header.attr('style', (i, attr) => {
            return attr === 'height:100%' ? 'height:auto' : 'height:100%';
        });
    }

    function toggleMobileMenu() {
        toggleHeaderHeight();

        $mobileMenuScrollView.scrollTop(0);

        $mobileMenuTrigger.toggleClass('is-open').attr('aria-expanded', (i, attr) => {
            return attr === 'true' ? 'false' : 'true';
        });

        $mobileMenu.toggleClass('is-open').attr('aria-hidden', (i, attr) => {
            return attr === 'true' ? 'false' : 'true';
        });

        $body.toggleClass('has-activeNavPages');
    }

    function mobileMenu() {
        $mobileMenuTrigger.on('click', (event) => {
            event.preventDefault();
            toggleMobileMenu();
        });

        // Hide the mobile sidebar if the cart is opened
        $('[data-cart-preview]').on('click', () => {
            if ($mobileMenuTrigger.hasClass('is-open')) {
                toggleMobileMenu();
            }
        });
    }

    if ($mobileMenuTrigger.length) {
        mobileMenu();
    }
}
