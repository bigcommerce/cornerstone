// Mimics ProvidePlugin configuration for jQuery
global.$ = global.jQuery = window.jQuery = require('jquery');

// Foundation requires existing script tag to load properly
document.getElementsByTagName('head')[0].appendChild(document.createElement('script'));

// jQuery thinks all elements are not visible under jsdom
// See https://github.com/jsdom/jsdom/issues/1048
window.Element.prototype.getClientRects = function () {
    var node = this;
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
    var self = $(this);
    // Mock width and height to prevent maximum call stack size exceeded error
    return [{ width: self.width() || 700, height: self.height() || 700 }];
};

// Mock window and document properties for jsdom
Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 500 });
Object.defineProperty(document.documentElement, 'clientHeight', { writable: true, configurable: true, value: 500 });
