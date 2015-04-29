import stencilUtils from 'bigcommerce/stencil-utils'
import { currencySelectorView } from './theme/currency-selector';
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
import product, { ProductView } from './theme/product/index';
import search from './theme/search';
import sitemap from './theme/sitemap';
import subscribe from './theme/subscribe';
import wishlist from './theme/wishlist';
import ko from 'knockout';

let modules = {
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
    "product": product,
    "search": search,
    "sitemap": sitemap,
    "subscribe": subscribe,
    "wishlist": wishlist
}, viewModel = {
    currencySelector: currencySelectorView,
    product: ProductView
};

// Bind view model
ko.applyBindings(viewModel);

export {modules};
