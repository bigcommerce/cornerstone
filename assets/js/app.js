import stencilUtils from 'bigcommerce/stencil-utils';
import async from 'caolan/async';
import account from './theme/account';
import auth from './theme/auth';
import blog from './theme/blog';
import brand from './theme/brand';
import brands from './theme/brands';
import cart from './theme/cart';
import category from './theme/category';
import compare from './theme/compare';
import errors from './theme/errors';
import errors404 from './theme/404-error';
import giftCertificate from './theme/gift-certificate';
import global from './theme/global';
import home from './theme/home';
import orderComplete from './theme/order-complete';
import page from './theme/page';
import product from './theme/product';
import search from './theme/search';
import sitemap from './theme/sitemap';
import subscribe from './theme/subscribe';
import wishlist from './theme/wishlist';

let PageClasses = {
    mapping: {
        "pages/account/orders/all": account,
        "pages/account/orders/details": account,
        "pages/account/addresses": account,
        "pages/account/add-address": account,
        "pages/account/add-return": account,
        "pages/account/add-wishlist": wishlist,
        "pages/account/recent-items": account,
        "pages/account/download-item": account,
        "pages/account/edit": account,
        "pages/account/return-saved": account,
        "pages/account/returns": account,
        "pages/auth/login": auth,
        "pages/auth/account-created": auth,
        "pages/auth/create-account": auth,
        "pages/auth/new-password": auth,
        "pages/blog": blog,
        "pages/blog-post": blog,
        "pages/brand": brand,
        "pages/brands": brand,
        "pages/cart": cart,
        "pages/category": category,
        "pages/compare": compare,
        "pages/errors": errors,
        "pages/errors/404": errors404,
        "pages/gift-certificate/purchase": giftCertificate,
        "pages/gift-certificate/balance": giftCertificate,
        "pages/gift-certificate/redeem": giftCertificate,
        "global": global,
        "pages/home": home,
        "pages/order-complete": orderComplete,
        "pages/page": page,
        "pages/product": product,
        "pages/search": search,
        "pages/sitemap": sitemap,
        "pages/subscribed": subscribe,
        "page/account/wishlist-details": wishlist,
        "pages/account/wishlists": wishlist
    },
    /**
     * Getter method to ensure a good page type is accessed.
     * @param page
     * @returns {*}
     */
    get: function(page) {
        if (this.mapping[page]) {
            return this.mapping[page];
        }
        return false;
    }
};

/**
 *
 * @param {Object} pageObj
 */
function series(pageObj) {
    async.series([
        pageObj.before.bind(pageObj), // Executed first after constructor()
        pageObj.loaded.bind(pageObj), // Main module logic
        pageObj.after.bind(pageObj) // Clean up method that can be overridden for cleanup.
    ], function (err) {
        if (err) {
            throw new Error(err);
        }
    })
}

/**
 * Loads the global module that gets executed on every page load.
 * Code that you want to run on every page goes in the global module.
 * @param {object} pages
 * @returns {*}
 */
function loadGlobal(pages) {
    let global = pages.get('global');
    return new global;
}

/**
 *
 * @param {function} pageFunc
 * @param {} pages
 */
function loader(pageFunc, pages) {
    if (pages.get('global')) {
        let globalPageManager = loadGlobal(pages);
        globalPageManager.context = pageFunc.context;

        series(globalPageManager);
    }
    series(pageFunc);
}

/**
 * This is the function that gets exported to JSPM
 * Gets the templateFile name passed in from the JSPM loader
 * @param templateFile String
 * @param context
 * @returns {*}
 */
export default function (templateFile, context) {
    let pages = PageClasses;

    context = context || '{}';
    context = JSON.parse(context);

    return {
        load() {
            $(() => {
                let pageTypeFn = pages.get(templateFile); // Finds the appropriate module from the pageType object and store the result as a function.
                if (pageTypeFn) {
                    let pageType = new pageTypeFn();
                    pageType.context = context;
                    return loader(pageType, pages);
                } else {
                    throw new Error(templateFile + ' Module not found')
                }
            });
        }
    }
};
