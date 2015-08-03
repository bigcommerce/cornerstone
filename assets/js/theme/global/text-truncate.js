import $ from 'jquery';
import _ from 'lodash';

export default class TextTruncate {
    constructor($element) {
        this.$element = $element;
        this.contentClass = 'textTruncate--hidden';
        this.options = $element.data('text-truncate') || {
            css: {},
            text: {
                viewMore: '',
                viewLess: ''
            }
        };
        this.defaultCssOptions = {
            'max-height': null,
            'text-overflow': null
        };
    }

    init() {
        this.setupAnchor();
        this.parseDataAttributes();
    }

    setupAnchor() {
        // create "view more" anchor
        this.createViewAnchor();
        this.appendViewAnchor();
        this.toggleState();
        this.bindAnchor();
    }

    createViewAnchor() {
        this.$viewAnchor = $('<a />', {
            'href': '#',
            'class': 'textTruncate-viewMore',
            'text': this.options.text.viewMore
        });
    }

    appendViewAnchor() {
        this.$element.append(this.$viewAnchor);
    }

    bindAnchor() {
        // bind anchor to this scope
        this.$viewAnchor.on('click', (e) => {
            e.preventDefault();
            // toggle state
            this.toggleState();
        });
    }

    toggleState() {
        this.$element.toggleClass(this.contentClass);

        if (this.$element.hasClass(this.contentClass)) {
            this.hideText();
        } else {
            this.showText();
        }
    }

    showText() {
        if (this.options.css['max-height']) {
            this.$element.css('max-height', '');
        }
        this.$viewAnchor.text(this.options.text.viewLess);
    }

    hideText() {
        if (this.options.css['max-height']) {
            this.$element.css('max-height', this.options.css['max-height']);
        }
        this.$viewAnchor.text(this.options.text.viewMore);
    }

    parseDataAttributes() {
        // override default css options
        _.forOwn(this.options.css, (value, key) => {
            if (key in this.defaultCssOptions && value) {
                this.$element.css(key, value);
            }
        });
    }
}
