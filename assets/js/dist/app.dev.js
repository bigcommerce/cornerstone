"use strict";

var _global = _interopRequireDefault(require("./theme/global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

__webpack_public_path__ = window.__webpack_public_path__; // eslint-disable-line

var getAccount = function getAccount() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./theme/account'));
  });
};

var getLogin = function getLogin() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('./theme/auth'));
  });
};

var noop = null;
var pageClasses = {
  account_orderstatus: getAccount,
  account_order: getAccount,
  account_addressbook: getAccount,
  shippingaddressform: getAccount,
  account_new_return: getAccount,
  'add-wishlist': function addWishlist() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/wishlist'));
    });
  },
  account_recentitems: getAccount,
  account_downloaditem: getAccount,
  editaccount: getAccount,
  account_inbox: getAccount,
  account_saved_return: getAccount,
  account_returns: getAccount,
  account_paymentmethods: getAccount,
  account_addpaymentmethod: getAccount,
  account_editpaymentmethod: getAccount,
  login: getLogin,
  createaccount_thanks: getLogin,
  createaccount: getLogin,
  getnewpassword: getLogin,
  forgotpassword: getLogin,
  blog: noop,
  blog_post: noop,
  brand: function brand() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/brand'));
    });
  },
  brands: noop,
  cart: function cart() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/cart'));
    });
  },
  category: function category() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/category'));
    });
  },
  compare: function compare() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/compare'));
    });
  },
  page_contact_form: function page_contact_form() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/contact-us'));
    });
  },
  error: noop,
  404: noop,
  giftcertificates: function giftcertificates() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/gift-certificate'));
    });
  },
  giftcertificates_balance: function giftcertificates_balance() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/gift-certificate'));
    });
  },
  giftcertificates_redeem: function giftcertificates_redeem() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/gift-certificate'));
    });
  },
  "default": noop,
  page: noop,
  product: function product() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/product'));
    });
  },
  amp_product_options: function amp_product_options() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/product'));
    });
  },
  search: function search() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/search'));
    });
  },
  rss: noop,
  sitemap: noop,
  newsletter_subscribe: noop,
  wishlist: function wishlist() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/wishlist'));
    });
  },
  wishlists: function wishlists() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./theme/wishlist'));
    });
  }
};
var customClasses = {};
/**
 * This function gets added to the global window and then called
 * on page load with the current template loaded and JS Context passed in
 * @param pageType String
 * @param contextJSON
 * @returns {*}
 */

window.stencilBootstrap = function stencilBootstrap(pageType) {
  var contextJSON = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var loadGlobal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var context = JSON.parse(contextJSON || '{}');
  return {
    load: function load() {
      $(function () {
        // Load globals
        if (loadGlobal) {
          _global["default"].load(context);
        }

        var importPromises = []; // Find the appropriate page loader based on pageType

        var pageClassImporter = pageClasses[pageType];

        if (typeof pageClassImporter === 'function') {
          importPromises.push(pageClassImporter());
        } // See if there is a page class default for a custom template


        var customTemplateImporter = customClasses[context.template];

        if (typeof customTemplateImporter === 'function') {
          importPromises.push(customTemplateImporter());
        } // Wait for imports to resolve, then call load() on them


        Promise.all(importPromises).then(function (imports) {
          imports.forEach(function (imported) {
            imported["default"].load(context);
          });
        });
      });
    }
  };
};