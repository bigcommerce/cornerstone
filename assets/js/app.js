import stencilUtils from 'bigcommerce/stencil-utils'
import async from 'caolan/async';
import account from './theme/account';
import auth from './theme/auth';
import blog from './theme/blog';
import brand from './theme/brand';
import brands from './theme/brands';
import cart from './theme/cart';
import category from './theme/category';
import compare from './theme/compare'
import errors from './theme/errors';
import giftCertificate from './theme/gift-certificate';
import home from './theme/home';
import orderComplete from './theme/order-complete';
import page from './theme/page';
//import product from './theme/product/index';
import search from './theme/search';
import sitemap from './theme/sitemap';
import subscribe from './theme/subscribe';
import wishlist from './theme/wishlist';
import currencySelector from './theme/currency-selector';

let pageTypes = {
    "account": account,
    "auth": auth,
    "blog": blog,
    "brand": brand,
    "brands": brand,
    "cart": cart,
    "category": category,
    "compare": compare,
    "errors": errors,
    "gift-certificate": giftCertificate,
    "home": home,
    "order-complete": orderComplete,
    "page": page,
    //"product": product,
    "search": search,
    "sitemap": sitemap,
    "subscribe": subscribe,
    "wishlist": wishlist
};

export default function (templateFile) {
    return {
        load() {
            let pageTypeFn = pageTypes[templateFile];
            let pageType = new pageTypeFn();
            return this.loader(pageType);
        },

        loader(pageFunc) {
            async.series([
                pageFunc.before,
                pageFunc.loaded,
                pageFunc.after
            ], function (err) {
                if (err) {
                    throw new Error(err)
                }
            });
        }
    }
};
