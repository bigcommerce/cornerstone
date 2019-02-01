// From https://github.com/jquery/jquery-migrate/blob/1.x-stable/src/traversing.js
//
// https://jquery.com/upgrade-guide/3.0/#breaking-change-deprecated-context-and-selector-properties-removed

/* eslint-disable prefer-rest-params, func-names */
export default function () {
    const oldFnFind = jQuery.fn.find;

    jQuery.fn.find = function (selector) {
        const ret = oldFnFind.apply(this, arguments);
        ret.context = this.context;
        ret.selector = this.selector ? `${this.selector} ${selector}` : selector;
        return ret;
    };
}
/* eslint-enable prefer-rest-params */
