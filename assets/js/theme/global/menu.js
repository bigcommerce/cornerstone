import $ from 'jquery';
import collapsibleFactory from '../common/collapsible';
import collapsibleGroupFactory from '../common/collapsible-group';

const PLUGIN_KEY = 'menu';

/*
 * Manage the behaviour of a menu
 * @param {jQuery} $menu
 */
class Menu {
    constructor($menu) {
        this.$menu = $menu;
        this.$body = $('body');

        // Init collapsible
        this.collapsibles = collapsibleFactory('[data-collapsible]', { $context: this.$menu });
        this.collapsibleGroups = collapsibleGroupFactory($menu);

        // Auto-bind
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);

        // Listen
        this.bindEvents();
    }

    collapseAll() {
        this.collapsibleGroups.forEach(group => group.close());
    }

    bindEvents() {
        this.$menu.on('click', this.onMenuClick);
        this.$body.on('click', this.onDocumentClick);
    }

    unbindEvents() {
        this.$menu.off('click', this.onMenuClick);
        this.$body.off('click', this.onDocumentClick);
    }

    onMenuClick(event) {
        event.stopPropagation();
    }

    onDocumentClick() {
        this.collapseAll();
    }
}

/*
 * Create a new Menu instance
 * @param {string} [selector]
 * @return {Menu}
 */
export default function menuFactory(selector = `[data-${PLUGIN_KEY}]`) {
    const $menu = $(selector).eq(0);
    const instanceKey = `${PLUGIN_KEY}-instance`;
    const cachedMenu = $menu.data(instanceKey);

    if (cachedMenu instanceof Menu) {
        return cachedMenu;
    }

    const menu = new Menu($menu);

    $menu.data(instanceKey, menu);

    return menu;
}
