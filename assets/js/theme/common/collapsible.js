import $ from 'jquery';
import mediaQueryListFactory from './media-query-list';

const PLUGIN_KEY = 'collapsible';

export const CollapsibleEvents = {
    open: 'open.collapsible',
    close: 'close.collapsible',
    toggle: 'toggle.collapsible',
    click: 'click.collapsible',
};

const CollapsibleState = {
    closed: 'closed',
    open: 'open',
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
     * @param {Object} [options] - Configurable options
     * @param {Object} [options.$context]
     * @param {Object} [options.disabledBreakpoint]
     * @param {Object} [options.disabledState]
     * @param {Object} [options.enabledState]
     * @param {Object} [options.openClassName]
     * @example
     *
     * <button id="#more">Collapse</button>
     * <div id="content">...</div>
     *
     * new Collapsible($('#more'), $('#content'));
     */
    constructor($toggle, $target, {
        disabledBreakpoint,
        disabledState,
        enabledState,
        openClassName = 'is-open',
    } = {}) {
        this.$toggle = $toggle;
        this.$target = $target;
        this.targetId = $target.attr('id');
        this.openClassName = openClassName;
        this.disabledState = disabledState;
        this.enabledState = enabledState;

        if (disabledBreakpoint) {
            this.disabledMediaQueryList = mediaQueryListFactory(disabledBreakpoint);
        }

        if (this.disabledMediaQueryList) {
            this.disabled = this.disabledMediaQueryList.matches;
        } else {
            this.disabled = false;
        }

        // Auto-bind
        this.onClicked = this.onClicked.bind(this);
        this.onDisabledMediaQueryListMatch = this.onDisabledMediaQueryListMatch.bind(this);

        // Assign DOM attributes
        this.$target.attr('aria-hidden', this.isCollapsed);
        this.$toggle
            .attr('aria-controls', $target.attr('id'))
            .attr('aria-expanded', this.isOpen);

        // Listen
        this.bindEvents();
    }

    get isCollapsed() {
        return !this.$target.hasClass(this.openClassName) || this.$target.is(':hidden');
    }

    get isOpen() {
        return !this.isCollapsed;
    }

    set disabled(disabled) {
        this._disabled = disabled;

        if (disabled) {
            this.toggleByState(this.disabledState);
        } else {
            this.toggleByState(this.enabledState);
        }
    }

    get disabled() {
        return this._disabled;
    }

    open({ notify = true } = {}) {
        this.$toggle
            .addClass(this.openClassName)
            .attr('aria-expanded', true);

        this.$target
            .addClass(this.openClassName)
            .attr('aria-hidden', false);

        if (notify) {
            this.$toggle.trigger(CollapsibleEvents.open, [this]);
            this.$toggle.trigger(CollapsibleEvents.toggle, [this]);
        }
    }

    close({ notify = true } = {}) {
        this.$toggle
            .removeClass(this.openClassName)
            .attr('aria-expanded', false);

        this.$target
            .removeClass(this.openClassName)
            .attr('aria-hidden', true);

        if (notify) {
            this.$toggle.trigger(CollapsibleEvents.close, [this]);
            this.$toggle.trigger(CollapsibleEvents.toggle, [this]);
        }
    }

    toggle() {
        if (this.isCollapsed) {
            this.open();
        } else {
            this.close();
        }
    }

    toggleByState(state, ...args) {
        switch (state) {
        case CollapsibleState.open:
            return this.open.apply(this, args);

        case CollapsibleState.closed:
            return this.close.apply(this, args);

        default:
            return undefined;
        }
    }

    hasCollapsible(collapsibleInstance) {
        return $.contains(this.$target.get(0), collapsibleInstance.$target.get(0));
    }

    bindEvents() {
        this.$toggle.on(CollapsibleEvents.click, this.onClicked);

        if (this.disabledMediaQueryList && this.disabledMediaQueryList.addListener) {
            this.disabledMediaQueryList.addListener(this.onDisabledMediaQueryListMatch);
        }
    }

    unbindEvents() {
        this.$toggle.off(CollapsibleEvents.click, this.onClicked);

        if (this.disabledMediaQueryList && this.disabledMediaQueryList.removeListener) {
            this.disabledMediaQueryList.removeListener(this.onDisabledMediaQueryListMatch);
        }
    }

    onClicked(event) {
        if (this.disabled) {
            return;
        }

        event.preventDefault();

        this.toggle();
    }

    onDisabledMediaQueryListMatch(media) {
        this.disabled = media.matches;
    }
}

/**
 * Convenience method for constructing Collapsible instance
 *
 * @param {string} [selector]
 * @param {Object} [options]
 * @param {Object} [options.$context]
 * @param {Object} [options.disabledBreakpoint]
 * @param {Object} [options.disabledState]
 * @param {Object} [options.enabledState]
 * @param {Object} [options.openClassName]
 * @return {Array} array of Collapsible instances
 *
 * @example
 * <a href="#content" data-collapsible>Collapse</a>
 * <div id="content">...</div>
 *
 * collapsibleFactory();
 */
export default function collapsibleFactory(selector = `[data-${PLUGIN_KEY}]`, options = {}) {
    const $collapsibles = $(selector, options.$context);

    return $collapsibles.map((index, element) => {
        const $toggle = $(element);
        let collapsible = $toggle.data(PLUGIN_KEY);

        if (collapsible instanceof Collapsible) {
            return collapsible;
        }

        const targetId = prependHash($toggle.data(PLUGIN_KEY) || $toggle.data(`${PLUGIN_KEY}-target`) || $toggle.attr('href'));

        options.disabledBreakpoint = $toggle.data(`${PLUGIN_KEY}-disabled-breakpoint`);
        options.disabledState = $toggle.data(`${PLUGIN_KEY}-disabled-state`);
        options.enabledState = $toggle.data(`${PLUGIN_KEY}-enabled-state`);
        options.openClassName = $toggle.data(`${PLUGIN_KEY}-open-class-name`);

        collapsible = new Collapsible($toggle, $(targetId), options);
        $toggle.data(PLUGIN_KEY, collapsible);

        return collapsible;
    }).toArray();
}
