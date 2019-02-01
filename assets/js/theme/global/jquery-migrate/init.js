// From https://github.com/jquery/jquery-migrate/blob/1.x-stable/src/core.js
//
// https://jquery.com/upgrade-guide/3.0/#breaking-change-deprecated-context-and-selector-properties-removed

/* eslint-disable prefer-rest-params, func-names */
export default function () {
    const oldInit = jQuery.fn.init;

    jQuery.fn.init = function (selector, context) {
        const ret = oldInit.apply(this, arguments);

        // Fill in selector and context properties so .live() works
        if (selector && selector.selector !== undefined) {
            // A jQuery object, copy its properties
            ret.selector = selector.selector;
            ret.context = selector.context;
        } else {
            ret.selector = typeof selector === 'string' ? selector : '';
            if (selector) {
                ret.context = selector.nodeType ? selector : context || document;
            }
        }

        return ret;
    };

    jQuery.fn.init.prototype = jQuery.fn;
}
/* eslint-enable prefer-rest-params */
