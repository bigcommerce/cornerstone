__webpack_public_path__ = window.__webpack_public_path__; // eslint-disable-line

import 'babel-polyfill';
import $ from 'jquery';
import Global from './theme/global';

const getAccount = () => import('./theme/account');
const getLogin = () => import('./theme/auth');
const pageClasses = {
    'pages/account/orders/all': getAccount,
    'pages/account/orders/details': getAccount,
    'pages/account/addresses': getAccount,
    'pages/account/add-address': getAccount,
    'pages/account/add-return': getAccount,
    'pages/account/add-wishlist': () => import('./theme/wishlist'),
    'pages/account/recent-items': getAccount,
    'pages/account/download-item': getAccount,
    'pages/account/edit': getAccount,
    'pages/account/inbox': getAccount,
    'pages/account/return-saved': getAccount,
    'pages/account/returns': getAccount,
    'pages/auth/login': getLogin,
    'pages/auth/account-created': getLogin,
    'pages/auth/create-account': getLogin,
    'pages/auth/new-password': getLogin,
    'pages/auth/forgot-password': getLogin,
    'pages/blog': () => import('./theme/blog'),
    'pages/blog-post': () => import('./theme/blog'),
    'pages/brand': () => import('./theme/brand'),
    'pages/brands': () => import('./theme/brand'),
    'pages/cart': () => import('./theme/cart'),
    'pages/category': () => import('./theme/category'),
    'pages/compare': () => import('./theme/compare'),
    'pages/contact-us': () => import('./theme/contact-us'),
    'pages/errors': () => import('./theme/errors'),
    'pages/errors/404': () => import('./theme/404-error'),
    'pages/gift-certificate/purchase': () => import('./theme/gift-certificate'),
    'pages/gift-certificate/balance': () => import('./theme/gift-certificate'),
    'pages/gift-certificate/redeem': () => import('./theme/gift-certificate'),
    'pages/home': () => import('./theme/home'),
    'pages/order-complete': () => import('./theme/order-complete'),
    'pages/page': () => import('./theme/page'),
    'pages/product': () => import('./theme/product'),
    'pages/amp/product-options': () => import('./theme/product'),
    'pages/search': () => import('./theme/search'),
    'pages/rss': () => import('./theme/rss'),
    'pages/sitemap': () => import('./theme/sitemap'),
    'pages/subscribed': () => import('./theme/subscribe'),
    'pages/account/wishlist-details': () => import('./theme/wishlist'),
    'pages/account/wishlists': () => import('./theme/wishlist'),
};

/**
 * This function gets added to the global window and then called
 * on page load with the current template loaded and JS Context passed in
 * @todo use page_type instead of template_file (STENCIL-2922)
 * @param templateFile String
 * @param contextJSON
 * @returns {*}
 */
window.stencilBootstrap = function stencilBootstrap(templateFile, contextJSON = null, loadGlobal = true) {
    const context = JSON.parse(contextJSON || {});

    return {
        load() {
            $(async () => {
                let globalClass;
                let pageClass;
                let PageClass;

                // Finds the appropriate class from the pageType.
                const pageClassImporter = pageClasses[templateFile];
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
