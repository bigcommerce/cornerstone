import $ from 'jquery';
import _ from 'lodash';
import 'history.js/scripts/bundled-uncompressed/html4+html5/jquery.history';
import PageManager from '../page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import compareProducts from './global/compare-products';
import privacyCookieNotification from './global/cookieNotification';
import maintenanceMode from './global/maintenanceMode';
import carousel from './common/carousel';
import loadingProgressBar from './global/loading-progress-bar';
import FastClick from 'fastclick';
import Drop from 'tether-drop';

function fastClick(element) {
    return new FastClick(element);
}

function stretchyNavbar() {
    $(document).on('scroll', _.throttle(() => {
        if ($(document).scrollTop() > 100) {
            $('header').addClass('shrink');
        } else {
            $('header').removeClass('shrink');
        }
    }, 250));
}

function tetherDropdowns() {
    const drops = Array.prototype.slice.call(document.querySelectorAll('[data-tether-dropdown]'));
    drops.forEach(el => {
        const position = el.dataset.tetherPosition || 'left';
        const drop = new Drop({
            target: el,
            content: document.getElementById(el.dataset.tetherDropdown),
            classes: 'drop-theme-basic',
            tetherOptions: {
                attachment: `bottom ${position}`,
                targetAttachment: `top ${position}`,
                constraints: [{ to: 'window', attachment: 'both' }],
            },
        });
    });
}

function shopMegaMenu() {
    const megaMenu = document.querySelector('[data-mega-menu]');
    const target = document.getElementById(megaMenu.dataset.megaMenu);
    megaMenu.onclick = (e) => {
        e.preventDefault();
        target.style.top = `${document.querySelector('header').offsetHeight}px`;
        $(target).slideToggle(500);
    };
}

export default class Global extends PageManager {
    /**
     * You can wrap the execution in this method with an asynchronous function map using the async library
     * if your global modules need async callback handling.
     * @param next
     */
    loaded(next) {
        fastClick(document.body);
        quickSearch();
        currencySelector();
        foundation($(document));
        quickView(this.context);
        cartPreview();
        compareProducts(this.context.urls);
        carousel();
        menu();
        mobileMenuToggle();
        privacyCookieNotification();
        maintenanceMode(this.context.maintenanceMode);
        loadingProgressBar();
        stretchyNavbar();
        shopMegaMenu();
        tetherDropdowns();
        next();
    }
}
