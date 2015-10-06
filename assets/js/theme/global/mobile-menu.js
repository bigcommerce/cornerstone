import $ from 'jquery';

export default function() {
    const $mobileMenuTrigger = $('[data-mobilemenu]');
    const $header = $('.header');
    const headerHeight = $('.header').outerHeight();
    const $mobileMenu = $('#mobile-menu');

    function calculateMobileMenuOffset() {
        $mobileMenu.attr('style', (i, attr) => {
            return attr !== `top:${headerHeight}px` ? `top:${headerHeight}px` : 'top:auto';
        });

        $header.attr('style', (i, attr) => {
            return attr === 'height:100%' ? 'height:auto' : 'height:100%';
        });
    }

    function toggleMobileMenu() {
        calculateMobileMenuOffset();

        $mobileMenuTrigger.toggleClass('is-open').attr('aria-expanded', (i, attr) => {
            return attr === 'true' ? 'false' : 'true';
        });

        $mobileMenu.toggleClass('is-open').attr('aria-hidden', (i, attr) => {
            return attr === 'true' ? 'false' : 'true';
        });
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
