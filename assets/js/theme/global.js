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
        next();
    }
}
