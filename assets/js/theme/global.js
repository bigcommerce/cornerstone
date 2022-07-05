import 'focus-within-polyfill';

import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import privacyCookieNotification from './global/cookieNotification';
import adminBar from './global/adminBar';
import carousel from './common/carousel';
import loadingProgressBar from './global/loading-progress-bar';
import svgInjector from './global/svg-injector';
import { mutationReady, productImpression, productClick, navigationClick } from "./global/gtm";

export default class Global extends PageManager {
    onReady() {
        const {
            channelId, cartId, productId, categoryId, secureBaseUrl, maintenanceModeSettings, adminBarLanguage, showAdminBar,
        } = this.context;
        cartPreview(secureBaseUrl, cartId);
        //quickSearch();
        currencySelector(cartId);
        foundation($(document));
        quickView(this.context);
        carousel(this.context);
        menu();
        mobileMenuToggle();
        privacyCookieNotification();
        if (showAdminBar) {
            adminBar(secureBaseUrl, channelId, maintenanceModeSettings, JSON.parse(adminBarLanguage), productId, categoryId);
        }
        loadingProgressBar();
        svgInjector();

        $(window).on( "scroll", e => {
            this.backToTopToggle();
        });
        
        this.backToTopToggle();

        // smooth scroll
        $('.smoothScroll').on('click', e => {
            e.preventDefault();

            // default to top of page
            let scrollTop = 0;
            const scrollTarget = $(e.target).attr('href');
            if (scrollTarget) {
                scrollTop = $(scrollTarget).offset().top - 120;
            }

            $('html, body').animate({
                scrollTop: scrollTop,
            }, 500, 'linear');
        });
    
        /* GTM Events: Begin */
        // product impression
        mutationReady();
        productImpression(this.context);
        productClick(this.context);
        
        // navigation clicked
        document.querySelectorAll
        ('.navPages-list > .navPages-item > .navPages-action:not(.has-subMenu), .navPage-subMenu-action, .navPage-childList-action, .footer-info-list a, .footer-sub-nav a')
        .forEach(navItem => {
            navItem.addEventListener('click', navigationClick);
        });
        /* GTM Events: End */
    }

    backToTopToggle() {
        var scrollTop = $(window).scrollTop();
        var scrollTopButton = $('.scroll-top-wrapper');
    
        if(scrollTop >= 1000) {
            if(!scrollTopButton.hasClass('active')) {
                scrollTopButton.stop().addClass('active').fadeIn(300);
            }
        } else {
            if(scrollTopButton.hasClass('active')) {
                $('.scroll-top-wrapper').stop().removeClass('active').fadeOut(300);
            }
        }    
    }
}
