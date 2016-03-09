import $ from 'jquery';
import _ from 'lodash';

export default class TextTruncate {
    constructor($element) {
        this.$element = $element;
        this.contentClass = 'textTruncate--visible';
        this.options = $element.data('text-truncate') || {
            css: {},
            text: {
                viewMore: '',
                viewLess: '',
            },
        };
        this.defaultCssOptions = {
            'max-height': '',
            'text-overflow': 'ellipsis',
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
        this.bindAnchor();
    }

    createViewAnchor() {
        this.$viewAnchor = $('<a />', {
            href: '#',
            class: 'textTruncate-viewMore',
            text: this.options.open ? this.options.text.viewLess : this.options.text.viewMore,
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
            this.showText();
        } else {
            this.hideText();
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
        _.forOwn(this.defaultCssOptions, (value, key) => {
            this.$element.css(key, value);
        });
    }
}
