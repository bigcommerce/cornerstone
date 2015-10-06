import $ from 'jquery';

export const CollapsibleEvents = {
    open: 'open.collapsible',
    close: 'close.collapsible',
    toggle: 'toggle.collapsible',
    click: 'click.collapsible',
};

/**
 * Collapse/Expand toggle
 */
export class Collapsible {
    /**
     * @param {jQuery} $toggle - Trigger button
     * @param {jQuery} $target - Content to collapse / expand
     * @param {object} [options] - Configurable options
     * @example
     *
     * <a href="#more">Collapse</a>
     * <div id="content">...</div>
     *
     * new Collapsible($('#more'), $('#content'));
     */
    constructor($toggle, $target, options = { openClassName: 'is-open' }) {
        this.$toggle = $toggle;
        this.$target = $target;
        this.targetId = $target.attr('id');
        this.options = options;

        this.bindEvents();
    }

    get isCollapsed() {
        const { openClassName } = this.options;

        return !this.$target.hasClass(openClassName) || this.$target.is(':hidden');
    }

    get isOpen() {
        return !isCollapsed;
    }

    open() {
        const { openClassName } = this.options;

        this.$toggle
            .addClass(openClassName)
            .attr('aria-expanded', true);

        this.$target
            .addClass(openClassName)
            .attr('aria-hidden', false);

        this.$toggle.trigger(CollapsibleEvents.open);
        this.$toggle.trigger(CollapsibleEvents.toggle);
    }

    close() {
        const { openClassName } = this.options;

        this.$toggle
            .removeClass(openClassName)
            .attr('aria-expanded', false);

        this.$target
            .removeClass(openClassName)
            .attr('aria-hidden', true);

        this.$toggle.trigger(CollapsibleEvents.close);
        this.$toggle.trigger(CollapsibleEvents.toggle);
    }

    toggle() {
        if (this.isCollapsed) {
            this.open();
        } else {
            this.close();
        }
    }

    bindEvents() {
        this.$toggle.on(CollapsibleEvents.click, this.onClicked.bind(this));
    }

    onClicked(event) {
        event.preventDefault();

        this.toggle();
    }
}

/*
 * Convenience method for constructing Collapsible instance
 *
 * @example
 * <a href="#more" data-collapsible>Collapse</a>
 * <div id="content">...</div>
 *
 * collapsible();
 */
export default function collapsible() {
    const pluginKey = 'collapsible';
    const $collapsibles = $(`[data-${ pluginKey }]`);

    $collapsibles.each((index, element) => {
        const $toggle = $(element);
        const isInitialized = $toggle.data(pluginKey) instanceof Collapsible;

        if (isInitialized) {
            return;
        }

        const targetId = $toggle.attr('href') || $toggle.data('target');
        const collapsibleInstance = new Collapsible($toggle, $(targetId));

        $toggle.data(pluginKey, collapsibleInstance);
    });
}
