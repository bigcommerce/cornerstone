import 'babel-polyfill';

import $ from 'jquery';
import account from './theme/account';
import auth from './theme/auth';
import blog from './theme/blog';
import brand from './theme/brand';
import cart from './theme/cart';
import category from './theme/category';
import contactUs from './theme/contact-us';
import compare from './theme/compare';
import errors from './theme/errors';
import errors404 from './theme/404-error';
import giftCertificate from './theme/gift-certificate';
import Global from './theme/global';
import home from './theme/home';
import orderComplete from './theme/order-complete';
import rss from './theme/rss';
import page from './theme/page';
import product from './theme/product';
import search from './theme/search';
import sitemap from './theme/sitemap';
import subscribe from './theme/subscribe';
import wishlist from './theme/wishlist';

const pageClasses = {
    'pages/account/orders/all': account,
    'pages/account/orders/details': account,
    'pages/account/addresses': account,
    'pages/account/add-address': account,
    'pages/account/add-return': account,
    'pages/account/add-wishlist': wishlist,
    'pages/account/recent-items': account,
    'pages/account/download-item': account,
    'pages/account/edit': account,
    'pages/account/inbox': account,
    'pages/account/return-saved': account,
    'pages/account/returns': account,
    'pages/auth/login': auth,
    'pages/auth/account-created': auth,
    'pages/auth/create-account': auth,
    'pages/auth/new-password': auth,
    'pages/auth/forgot-password': auth,
    'pages/blog': blog,
    'pages/blog-post': blog,
    'pages/brand': brand,
    'pages/brands': brand,
    'pages/cart': cart,
    'pages/category': category,
    'pages/compare': compare,
    'pages/contact-us': contactUs,
    'pages/errors': errors,
    'pages/errors/404': errors404,
    'pages/gift-certificate/purchase': giftCertificate,
    'pages/gift-certificate/balance': giftCertificate,
    'pages/gift-certificate/redeem': giftCertificate,
    'pages/home': home,
    'pages/order-complete': orderComplete,
    'pages/page': page,
    'pages/product': product,
    'pages/amp/product-options': product,
    'pages/search': search,
    'pages/rss': rss,
    'pages/sitemap': sitemap,
    'pages/subscribed': subscribe,
    'pages/account/wishlist-details': wishlist,
    'pages/account/wishlists': wishlist,
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
            $(() => {
                let pageClass;
                let globalClass;
                // Finds the appropriate class from the pageType.
                const PageClass = pageClasses[templateFile];

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
