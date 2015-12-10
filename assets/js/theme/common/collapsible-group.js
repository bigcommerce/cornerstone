import $ from 'jquery';
import { CollapsibleEvents } from '../common/collapsible';

const PLUGIN_KEY = 'collapsible-group';

/*
 * Manage multiple instances of collapsibles. For example, if a collapsible is
 * about to open and there's one already open, close the latter first.
 * @param {jQuery} $component
 */
export class CollapsibleGroup {
    constructor($component) {
        this.$component = $component;
        this.openCollapsible = null;

        // Auto bind
        this.onCollapsibleOpen = this.onCollapsibleOpen.bind(this);
        this.onCollapsibleClose = this.onCollapsibleClose.bind(this);

        // Listen
        this.bindEvents();
    }

    close() {
        if (this.openCollapsible && !this.openCollapsible.disabled) {
            this.openCollapsible.close();
        }
    }

    bindEvents() {
        this.$component.on(CollapsibleEvents.open, this.onCollapsibleOpen);
        this.$component.on(CollapsibleEvents.close, this.onCollapsibleClose);
    }

    unbindEvents() {
        this.$component.off(CollapsibleEvents.open, this.onCollapsibleOpen);
        this.$component.off(CollapsibleEvents.close, this.onCollapsibleClose);
    }

    onCollapsibleOpen(event, collapsibleInstance) {
        if (this.openCollapsible && this.openCollapsible.hasCollapsible(collapsibleInstance)) {
            return;
        }

        this.close();

        this.openCollapsible = collapsibleInstance;
    }

    onCollapsibleClose(event, collapsibleInstance) {
        if (this.openCollapsible && this.openCollapsible.hasCollapsible(collapsibleInstance)) {
            return;
        }

        this.openCollapsible = null;
    }
}

/**
 * Create new CollapsibleGroup instances
 * @param {string} [selector]
 * @param {Object} [options]
 * @param {Object} [options.$context]
 * @return {Array} array of CollapsibleGroup instances
 */
export default function collapsibleGroupFactory(selector = `[data-${PLUGIN_KEY}]`, options = {}) {
    const $groups = $(selector, options.$context);
    const instanceKey = `${PLUGIN_KEY}-instance`;

    return $groups.map((index, element) => {
        const $group = $(element);
        const cachedGroup = $group.data(instanceKey);

        if (cachedGroup instanceof CollapsibleGroup) {
            return cachedGroup;
        }

        const group = new CollapsibleGroup($group);

        $group.data(instanceKey, group);

        return group;
    }).toArray();
}
