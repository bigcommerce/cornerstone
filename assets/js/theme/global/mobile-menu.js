import $ from 'jquery';
import collapsibleFactory from '../common/collapsible';
import collapsibleGroupFactory from '../common/collapsible-group';
import mediaQueryListFactory from '../common/media-query-list';
import { CartPreviewEvents } from './cart-preview';

const PLUGIN_KEY = 'mobilemenu';

/*
 * Manage the behaviour of a mobile menu
 * @param {jQuery} $trigger
 * @param {Object} [options]
 * @param {Object} [options.bodySelector]
 * @param {Object} [options.headerSelector]
 * @param {Object} [options.menuSelector]
 * @param {Object} [options.scrollViewSelector]
 */
export class MobileMenu {
    constructor($trigger, {
        bodySelector = 'body',
        headerSelector = '.header',
        menuSelector = '#menu',
        scrollViewSelector = '.navPages',
    } = {}) {
        this.$body = $(bodySelector);
        this.$menu = $(menuSelector);
        this.$header = $(headerSelector);
        this.$scrollView = $(scrollViewSelector, this.$menu);
        this.$trigger = $trigger;
        this.mediumMediaQueryList = mediaQueryListFactory('medium');

        // Init collapsible
        this.collapsibles = collapsibleFactory('[data-collapsible]', { $context: this.$menu });
        this.collapsibleGroups = collapsibleGroupFactory(menuSelector);

        // Auto-bind
        this.onTriggerClick = this.onTriggerClick.bind(this);
        this.onCartPreviewOpen = this.onCartPreviewOpen.bind(this);
        this.onMediumMediaQueryMatch = this.onMediumMediaQueryMatch.bind(this);

        // Listen
        this.bindEvents();
    }

    get isOpen() {
        return this.$menu.hasClass('is-open');
    }

    bindEvents() {
        this.$trigger.on('click', this.onTriggerClick);
        this.$header.on(CartPreviewEvents.open, this.onCartPreviewOpen);

        if (this.mediumMediaQueryList && this.mediumMediaQueryList.addListener) {
            this.mediumMediaQueryList.addListener(this.onMediumMediaQueryMatch);
        }
    }

    unbindEvents() {
        this.$trigger.off('click', this.onTriggerClick);
        this.$header.off(CartPreviewEvents.open, this.onCartPreviewOpen);

        if (this.mediumMediaQueryList && this.mediumMediaQueryList.addListener) {
            this.mediumMediaQueryList.removeListener(this.onMediumMediaQueryMatch);
        }
    }

    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.$body.addClass('has-activeNavPages');

        this.$trigger
            .addClass('is-open')
            .attr('aria-expanded', true);

        this.$menu
            .addClass('is-open')
            .attr('aria-hidden', false);

        this.$header.addClass('is-open');
        this.$scrollView.scrollTop(0);
    }

    hide() {
        this.$body.removeClass('has-activeNavPages');

        this.$trigger
            .removeClass('is-open')
            .attr('aria-expanded', false);

        this.$menu
            .removeClass('is-open')
            .attr('aria-hidden', true);

        this.$header.removeClass('is-open');
    }

    // Private
    onTriggerClick(event) {
        event.preventDefault();

        this.toggle();
    }

    onCartPreviewOpen() {
        if (this.isOpen) {
            this.hide();
        }
    }

    onMediumMediaQueryMatch(media) {
        if (!media.matches) {
            return;
        }

        this.hide();
    }
}

/*
 * Create a new MobileMenu instance
 * @param {string} [selector]
 * @param {Object} [options]
 * @param {Object} [options.bodySelector]
 * @param {Object} [options.headerSelector]
 * @param {Object} [options.menuSelector]
 * @param {Object} [options.scrollViewSelector]
 * @return {MobileMenu}
 */
export default function mobileMenuFactory(selector = `[data-${PLUGIN_KEY}]`, options = {}) {
    const $trigger = $(selector).eq(0);
    let mobileMenu = $trigger.data(PLUGIN_KEY);

    if (mobileMenu instanceof MobileMenu) {
        return mobileMenu;
    } else if (typeof mobileMenu === 'string') {
        options.menuSelector = `#${mobileMenu}`;
    }

    mobileMenu = new MobileMenu($trigger, options);
    $trigger.data(PLUGIN_KEY, mobileMenu);

    return mobileMenu;
}
