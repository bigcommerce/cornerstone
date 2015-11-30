import $ from 'jquery';

const PLUGIN_KEY = 'collapsible';

export const CollapsibleEvents = {
    open: 'open.collapsible',
    close: 'close.collapsible',
    toggle: 'toggle.collapsible',
    click: 'click.collapsible',
};

function prependHash(id) {
    if (id && id.indexOf('#') === 0) {
        return id;
    }

    return `#${id}`;
}

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
     * <button id="#more">Collapse</button>
     * <div id="content">...</div>
     *
     * new Collapsible($('#more'), $('#content'));
     */
    constructor($toggle, $target, options = { openClassName: 'is-open' }) {
        this.$toggle = $toggle;
        this.$target = $target;
        this.targetId = $target.attr('id');
        this.options = options;

        // Assign
        this.$target.attr('aria-hidden', this.isCollapsed);
        this.$toggle
            .attr('aria-controls', $target.attr('id'))
            .attr('aria-expanded', this.isOpen);

        // Listen
        this.bindEvents();
    }

    get isCollapsed() {
        const { openClassName } = this.options;

        return !this.$target.hasClass(openClassName) || this.$target.is(':hidden');
    }

    get isOpen() {
        return !this.isCollapsed;
    }

    open() {
        const { openClassName } = this.options;

        this.$toggle
            .addClass(openClassName)
            .attr('aria-expanded', true);

        this.$target
            .addClass(openClassName)
            .attr('aria-hidden', false);

        this.$toggle.trigger(CollapsibleEvents.open, [this]);
        this.$toggle.trigger(CollapsibleEvents.toggle, [this]);
    }

    close() {
        const { openClassName } = this.options;

        this.$toggle
            .removeClass(openClassName)
            .attr('aria-expanded', false);

        this.$target
            .removeClass(openClassName)
            .attr('aria-hidden', true);

        this.$toggle.trigger(CollapsibleEvents.close, [this]);
        this.$toggle.trigger(CollapsibleEvents.toggle, [this]);
    }

    toggle() {
        if (this.isCollapsed) {
            this.open();
        } else {
            this.close();
        }
    }

    hasCollapsible(collapsibleInstance) {
        return $.contains(this.$target.get(0), collapsibleInstance.$target.get(0));
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
 * <a href="#content" data-collapsible>Collapse</a>
 * <div id="content">...</div>
 *
 * collapsibleFactory();
 */
export default function collapsibleFactory(selector = `[data-${PLUGIN_KEY}]`) {
    const $collapsibles = $(selector);

    return $collapsibles.map((index, element) => {
        const $toggle = $(element);
        let collapsible = $toggle.data(PLUGIN_KEY);

        if (collapsible instanceof Collapsible) {
            return collapsible;
        }

        const targetId = prependHash($toggle.data(PLUGIN_KEY) || $toggle.data('target') || $toggle.attr('href'));

        collapsible = new Collapsible($toggle, $(targetId));
        $toggle.data(PLUGIN_KEY, collapsible);

        return collapsible;
    });
}
