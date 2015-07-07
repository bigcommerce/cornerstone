import { hooks, api } from 'bigcommerce/stencil-utils';
import $ from 'jquery';
import _ from 'lodash';
import Url from 'url';
import History from 'browserstate/history.js/scripts/bundled-uncompressed/html4+html5/jquery.history';

function goToUrl(url) {
    History.pushState({}, document.title, url);
}

/**
 * Faceted search view component
 */
export default class FacetedSearch {
    /**
     * @param {object} templates - Map of templates to fetch
     * @param {function} callback - Function to execute after fetching templates
     * @param {object} options - Configurable options
     * @example
     *
     * let templates = {
     *     productListing: 'category/product-listing',
     *     sidebar: 'category/sidebar'
     * };
     *
     * let templatesDidLoad = function(content) {
     *     $productListingContainer.html(content.productListing);
     *     $facetedSearchContainer.html(content.sidebar);
     * };
     *
     * let facetedSearch = new FacetedSearch(templates, templatesDidLoad);
     */
    constructor(templates, callback, options) {
        let defaultOptions = {
           loadingIndicatorSelector: '#loadingNotification',
           blockerSelector: '#facetedSearch .blocker',
           showMoreToggleSelector: '#facetedSearch .toggleLink',
           facetNavListSelector: '#facetedSearch .navList',
           accordionToggleSelector: '#facetedSearch .accordion-title'
        };

        // Private properties
        this.templates = templates;
        this.callback = callback;
        this.options = _.extend({}, defaultOptions, options);
        this.collapsedFacets = [];
        this.collapsedFacetItems = [];

        // Show limited items by default
        $(this.options.facetNavListSelector).each((index, navList) => {
            this.collapseFacetItems($(navList));
        });

        // Mark initially collapsed accordions
        $(this.options.accordionToggleSelector).each((index, accordionToggle) => {
            let selector = $(accordionToggle).attr('href'),
                id = selector.replace(/^#/, '');

            if (!$(selector).hasClass('is-open')) {
                this.collapsedFacets.push(id);
            }
        });

        // Observe user events
        this.bindEvents();
    }

    // Public methods
    refreshView(content) {
        if (content) {
            this.callback(content);
        }

        // Restore view state
        this.restoreCollapsedFacets();
        this.restoreCollapsedFacetItems();
    }

    expandFacetItems($navList) {
        let id = $navList.attr('id'),
            $navItems = $navList.children(),
            $toggle = $navList.next(this.showMoreToggleSelector);

        // Show all items
        $navItems.show();

        // Set toggle state
        $toggle.addClass('is-off');

        // Remove
        this.collapsedFacetItems = _.without(this.collapsedFacetItems, id);
    }

    collapseFacetItems($navList) {
        let $navItems = $navList.children(),
            $toggle = $navList.next(this.showMoreToggleSelector),
            id = $navList.attr('id'),
            itemsCount = $navItems.length,
            maxItemsCount = parseInt($navList.data('count'), 10);

        $navItems.show();

        // Set toggle state
        $toggle.removeClass('is-off');

        // Show only limited number of items, hide the rest
        if (itemsCount > maxItemsCount) {
            $navItems
                .slice(maxItemsCount, itemsCount)
                .hide();

            this.collapsedFacetItems = _.union(this.collapsedFacetItems, [id]);
        } else {
            this.collapsedFacetItems = _.without(this.collapsedFacetItems, id);
        }
    }

    toggleFacetItems($navList) {
        let id = $navList.attr('id');

        // Toggle depending on `collapsed` flag
        if (_.contains(this.collapsedFacetItems, id)) {
            this.expandFacetItems($navList);

            return true;
        } else {
            this.collapseFacetItems($navList);

            return false;
        }
    }

    expandFacet($accordionToggle) {
        let selector = $accordionToggle.attr('href');

        if (!$(selector).hasClass('is-open')) {
            $accordionToggle.trigger('click.fndtn.accordion');
        }
    }

    collapseFacet($accordionToggle) {
        let selector = $accordionToggle.attr('href');

        if ($(selector).hasClass('is-open')) {
            $accordionToggle.trigger('click.fndtn.accordion');
        }
    }

    collapseAllFacets() {
        let $accordionToggles = $(this.options.accordionToggleSelector);

        $accordionToggles.each((index, accordionToggle) => {
            let $accordionToggle = $(accordionToggle);

            this.collapseFacet($accordionToggle);
        });
    }

    expandAllFacets() {
        let $accordionToggles = $(this.options.accordionToggleSelector);

        $accordionToggles.each((index, accordionToggle) => {
            let $accordionToggle = $(accordionToggle);

            this.expandFacet($accordionToggle);
        });
    }

    // Private methods
    restoreCollapsedFacetItems() {
        let $navLists = $(this.options.facetNavListSelector);

        // Restore collapsed state for each facet
        $navLists.each((index, navList) => {
            let $navList = $(navList),
                id = $navList.attr('id'),
                shouldCollapse = _.contains(this.collapsedFacetItems, id);

            if (shouldCollapse) {
                this.collapseFacetItems($navList);
            } else {
                this.expandFacetItems($navList);
            }
        });
    }

    restoreCollapsedFacets() {
        let $accordionToggles = $(this.options.accordionToggleSelector);

        $accordionToggles.each((index, accordionToggle) => {
            let $accordionToggle = $(accordionToggle),
                id = $accordionToggle.attr('href').replace(/^#/, ''),
                shouldCollapse = _.contains(this.collapsedFacets, id);

            if (shouldCollapse) {
                this.collapseFacet($accordionToggle);
            } else {
                this.expandFacet($accordionToggle);
            }
        });
    }

    bindEvents() {
        // DOM events
        $(window).on('statechange', this.onStateChange.bind(this));
        $(document).on('click', this.options.showMoreToggleSelector, this.onToggleClick.bind(this));

        // Foundation events
        $(document).foundation({
            accordion: {
                callback: this.onAccordionToggle.bind(this)
            }
        });

        // Hooks
        hooks.on('facetedSearch-facet-clicked', this.onFacetClick.bind(this));
        hooks.on('facetedSearch-range-submitted', this.onRangeSubmit.bind(this));
        hooks.on('sortBy-submitted', this.onSortBySubmit.bind(this));
    }

    onToggleClick(event) {
        let $toggle = $(event.currentTarget),
            $navList = $($toggle.attr('href'));

        // Prevent default
        event.preventDefault();

        // Toggle visible items
        this.toggleFacetItems($navList);
    }

    onFacetClick(event) {
        let $link = $(event.currentTarget),
            url = $link.attr('href');

        event.preventDefault();

        $link.toggleClass('is-selected');

        // Update URL
        goToUrl(url);
    }

    onRangeSubmit(event) {
        let url = Url.parse(location.href),
            queryParams = $(event.currentTarget).serialize();

        event.preventDefault();

        goToUrl(Url.format({ pathname: url.pathname, search: '?' + queryParams }));
    }

    onSortBySubmit(event) {
        let url = Url.parse(location.href, true),
            queryParams = $(event.currentTarget).serialize().split('=');

        url.query[queryParams[0]] = queryParams[1];

        event.preventDefault();

        goToUrl(Url.format({ pathname: url.pathname, query: url.query }));
    }

    onStateChange(event) {
        $(this.options.loadingIndicatorSelector).show();
        $(this.options.blockerSelector).show();

        api.getPage(History.getState().url, { template: this.templates }, (err, content) => {
            if (err) {
                throw new Error(err);
            }

            $(this.options.loadingIndicatorSelector).hide();
            $(this.options.blockerSelector).hide();

            // Refresh view with new content
            this.refreshView(content);
        });
    }

    onAccordionToggle(accordion) {
        let $accordion = $(accordion),
            id = $accordion.attr('id');

        if ($accordion.hasClass('is-open')) {
            this.collapsedFacets = _.without(this.collapsedFacets, id);
        } else {
            this.collapsedFacets = _.union(this.collapsedFacets, [id]);
        }
    }
}
