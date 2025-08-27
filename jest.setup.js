// Mimics ProvidePlugin configuration for jQuery
const jquery = require('jquery');

global.$ = jquery;
global.jQuery = jquery;
window.jQuery = jquery;

// Foundation requires existing script tag to load properly
document.getElementsByTagName('head')[0].appendChild(document.createElement('script'));

// jQuery thinks all elements are not visible under jsdom
// See https://github.com/jsdom/jsdom/issues/1048
window.Element.prototype.getClientRects = function () {
    let node = this;
    while (node) {
        if (node === document) {
            break;
        }
        // don't know why but style is sometimes undefined
        if (!node.style || node.style.display === 'none' || node.style.visibility === 'hidden') {
            return [];
        }
        node = node.parentNode;
    }
    return [{ width: this.offsetWidth, height: this.offsetHeight }];
};
