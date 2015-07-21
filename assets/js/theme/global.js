import $ from 'jquery';
import PageManager from '../page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import toggleMenu from './global/toggle-menu';
import mobileMenu from './global/mobile-menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import compareProducts from './global/compare-products';
import privacyCookieNotification from './global/cookieNotification';
import carousel from './common/carousel';
import loadingProgressBar from './global/loading-progress-bar';

export default class Global extends PageManager {
    constructor() {
        super();
    }

    /**
     * You can wrap the execution in this method with an asynchronous function map using the async library
     * if your global modules need async callback handling.
     * @param next
     */
    loaded(next) {
        quickSearch();
        currencySelector();
        foundation();
        quickView(this.context);
        cartPreview();
        compareProducts();
        carousel();
        toggleMenu();
        mobileMenu();
        privacyCookieNotification();
        loadingProgressBar();
        next();
    }
}
