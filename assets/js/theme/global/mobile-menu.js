import $ from 'jquery';

export default function() {
    const $mobileMenuTrigger = $('[data-mobilemenu]');
    const $header = $('.header');
    const headerHeight = $('.header').outerHeight();
    const $mobileMenu = $('#mobile-menu');

    function mobileMenu() {
        $mobileMenuTrigger.on('click', toggleMobileMenu);
    }

    function toggleMobileMenu(e) {
        e.preventDefault();

        calculateMobileMenuOffset();

        $mobileMenuTrigger.toggleClass('is-open').attr('aria-expanded', (i, attr) => {
            return attr === 'true' ? 'false' : 'true';
        });

        $mobileMenu.toggleClass('is-open').attr('aria-hidden', (i, attr) => {
            return attr === 'true' ? 'false' : 'true';
        });
    }

    function calculateMobileMenuOffset() {
        $mobileMenu.attr('style', (i, attr) => {
            return attr !== `top:${headerHeight}px` ? `top:${headerHeight}px` : 'top:auto';
        });

        $header.attr('style', (i, attr) => {
            return attr === 'height:100%' ? 'height:auto' : 'height:100%';
        });
    }

    if ($mobileMenuTrigger.length) {
        mobileMenu();
    }
}
