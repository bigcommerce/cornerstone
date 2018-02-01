__webpack_public_path__ = window.__webpack_public_path__; // eslint-disable-line

import 'babel-polyfill';
import $ from 'jquery';
import 'jquery-migrate';
import Global from './theme/global';

const getAccount = () => import('./theme/account');
const getLogin = () => import('./theme/auth');
const pageClasses = {
    account_orderstatus: getAccount,
    account_order: getAccount,
    account_addressbook: getAccount,
    shippingaddressform: getAccount,
    account_new_return: getAccount,
    'add-wishlist': () => import('./theme/wishlist'),
    account_recentitems: getAccount,
    account_downloaditem: getAccount,
    editaccount: getAccount,
    account_inbox: getAccount,
    account_saved_return: getAccount,
    account_returns: getAccount,
    login: getLogin,
    createaccount_thanks: getLogin,
    createaccount: getLogin,
    getnewpassword: getLogin,
    forgotpassword: getLogin,
    blog: () => import('./theme/blog'),
    blog_post: () => import('./theme/blog'),
    brand: () => import('./theme/brand'),
    brands: () => import('./theme/brand'),
    cart: () => import('./theme/cart'),
    category: () => import('./theme/category'),
    compare: () => import('./theme/compare'),
    page_contact_form: () => import('./theme/contact-us'),
    error: () => import('./theme/errors'),
    404: () => import('./theme/404-error'),
    giftcertificates: () => import('./theme/gift-certificate'),
    giftcertificates_balance: () => import('./theme/gift-certificate'),
    giftcertificates_redeem: () => import('./theme/gift-certificate'),
    default: () => import('./theme/home'),
    page: () => import('./theme/page'),
    product: () => import('./theme/product'),
    amp_product_options: () => import('./theme/product'),
    search: () => import('./theme/search'),
    rss: () => import('./theme/rss'),
    sitemap: () => import('./theme/sitemap'),
    newsletter_subscribe: () => import('./theme/subscribe'),
    wishlist: () => import('./theme/wishlist'),
    wishlists: () => import('./theme/wishlist'),
};

/**
 * This function gets added to the global window and then called
 * on page load with the current template loaded and JS Context passed in
 * @param pageType String
 * @param contextJSON
 * @returns {*}
 */
window.stencilBootstrap = function stencilBootstrap(pageType, contextJSON = null, loadGlobal = true) {
    const context = JSON.parse(contextJSON || {});

    return {
        load() {
            $(async () => {
                let globalClass;
                let pageClass;
                let PageClass;

                // Finds the appropriate class from the pageType.
                const pageClassImporter = pageClasses[pageType];
                if (typeof pageClassImporter === 'function') {
                    PageClass = (await pageClassImporter()).default;
                }

                if (loadGlobal) {
                    globalClass = new Global();
                    globalClass.context = context;
                }

                if (PageClass) {
                    pageClass = new PageClass(context);
                    pageClass.context = context;
                }

                if (globalClass) {
                    globalClass.load();
                }

                if (pageClass) {
                    pageClass.load();
                }
            });
        },
    };
};
