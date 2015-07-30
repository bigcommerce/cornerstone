import $ from 'jquery';
import _ from 'lodash';

export default class TextTruncate {
    constructor($element) {
        this.$element = $element;
        this.contentClass = 'textTruncate--hidden';
        this.$options = $element.data('text-truncate') || {
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
        this.$viewAnchor = $(`<a href="#" class="textTruncate-viewMore">${this.$options.text.viewMore}</a>`);
        this.$element.append(this.$viewAnchor);
        this.maxHeight = this.$element.css('max-height');

        this.bindAnchor()
    }

    bindAnchor() {
        // bind anchor to this scope
        this.$viewAnchor.on('click', (e) => {
            e.preventDefault();

            // toggle class
            this.$element.toggleClass(this.contentClass);

            this.swapAnchorText()
        });
    }

    swapAnchorText() {
        if (this.$element.hasClass(this.contentClass)) {
            this.$element.css('max-height', this.maxHeight);
            this.$viewAnchor.text(this.$options.text.viewMore);
        } else {
            this.$element.css('max-height', '');
            this.$viewAnchor.text(this.$options.text.viewLess);
        }
    }

    parseDataAttributes() {
        // override default css options
        _.forOwn(this.$options.css, (value, key) => {
            if (key in this.defaultCssOptions && value) {
                this.$element.css(key, value);
            }
        });
    }
}
