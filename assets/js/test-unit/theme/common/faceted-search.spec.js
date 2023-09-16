import FacetedSearch from '../../../theme/common/faceted-search';
import { Validators } from '../../../theme/common/utils/form-utils';
import $ from 'jquery';
import { hooks, api } from '@bigcommerce/stencil-utils';
import urlUtils from '../../../theme/common/utils/url-utils';

describe('FacetedSearch', () => {
    let facetedSearch;
    let requestOptions;
    let onSearchSuccess;
    let html;
    let $element;
    let options;

    beforeEach(() => {
        onSearchSuccess = jest.fn();

        requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
        };

        options = {
            validationErrorMessages: {
                onMinPriceError: jasmine.any(String),
                onMaxPriceError: jasmine.any(String),
                minPriceNotEntered: jasmine.any(String),
                maxPriceNotEntered: jasmine.any(String),
                onInvalidPrice: jasmine.any(String),
            },
        };

        html =
            '<div id="facetedSearch">' +
                '<a class="facetedSearch-clearLink">Clear</a>' +
                '<div id="facetedSearch-navList">' +
                    '<ul class="navList" id="facet-brands" data-count="2" data-has-more-results="true">' +
                        '<li><a href="?brand=item1">Facet Item 1</a></li>' +
                        '<li><a href="?brand=item2">Facet Item 2</a></li>' +
                        '<li><a href="?brand=item3">Facet Item 3</a></li>' +
                        '<li><a href="?brand=item4">Facet Item 4</a></li>' +
                    '</ul>' +
                    '<form id="facet-sort">' +
                        '<select name="sort">' +
                            '<option value="featured">Featured</option>' +
                            '<option value="newest">Newest</option>' +
                        '</select>' +
                    '</form>' +
                    '<form id="facet-range-form">' +
                        '<input name="min_price" value="0">' +
                        '<input name="max_price" value="100">' +
                    '</form>' +
                    '<form id="facet-range-form-with-other-facets">' +
                        '<input name="brand[]" value="item1">' +
                        '<input name="brand[]" value="item2">' +
                        '<input name="min_price" value="0">' +
                        '<input name="max_price" value="50">' +
                    '</form>' +
                '</div>' +
            '</div>';

        $element = $(html);
        $element.appendTo(document.body);
        facetedSearch = new FacetedSearch(requestOptions, onSearchSuccess, options);
    });

    afterEach(() => {
        facetedSearch.unbindEvents();

        $element.remove();
    });

    describe('refreshView', () => {
        let content;

        beforeEach(() => {
            content = { html: '<div>Results</div>' };

            jest.spyOn(facetedSearch, 'restoreCollapsedFacets').mockImplementation(() => {});
            jest.spyOn(facetedSearch, 'restoreCollapsedFacetItems').mockImplementation(() => {});
            jest.spyOn(Validators, 'setMinMaxPriceValidation').mockImplementation(() => {});
        });

        it('should update view with content by firing registered callback', () => {
            facetedSearch.refreshView(content);

            expect(onSearchSuccess).toHaveBeenCalledWith(content);
        });

        it('should restore all collapsed facets', () => {
            facetedSearch.refreshView(content);

            expect(facetedSearch.restoreCollapsedFacets).toHaveBeenCalled();
        });

        it('should restore all collapsed facet items', () => {
            facetedSearch.refreshView(content);

            expect(facetedSearch.restoreCollapsedFacetItems).toHaveBeenCalled();
        });

        it('should re-init price range validator', function() {
            facetedSearch.refreshView(content);

            expect(Validators.setMinMaxPriceValidation).toHaveBeenCalledWith(facetedSearch.priceRangeValidator, jasmine.any(Object), options.validationErrorMessages);
        });
    });

    describe('updateView', () => {
        let content;
        const url = '/current/path?facet=1';

        beforeEach(() => {
            jest.spyOn(api, 'getPage').mockImplementation(() => {});
            jest.spyOn(facetedSearch, 'refreshView').mockImplementation(() => {});
            jest.spyOn(urlUtils, 'getUrl').mockImplementation(() => url);

            content = {};
        });

        it('should fetch content from remote server', function() {
            facetedSearch.updateView();

            expect(api.getPage).toHaveBeenCalledWith(url, requestOptions, expect.any(Function));
        });

        it('should refresh view', function() {
            jest.spyOn(api, 'getPage').mockImplementation(function(url, options, callback) {
                callback(null, content);
            });

            facetedSearch.updateView();

            expect(facetedSearch.refreshView).toHaveBeenCalled();
        });
    });

    describe('expandFacetItems', () => {
        it('should remove from `collapsedFacetItems`', function() {
            facetedSearch.collapsedFacetItems = ['facet-brands'];
            facetedSearch.expandFacetItems($('#facet-brands'));

            expect(facetedSearch.collapsedFacetItems).not.toContain('facet-brands');
        });
    });

    describe('collapseFacetItems', () => {
        it('should add to `collapsedFacetItems`', function() {
            facetedSearch.collapseFacetItems($('#facet-brands'));

            expect(facetedSearch.collapsedFacetItems).toContain('facet-brands');
        });
    });

    describe('toggleFacetItems', () => {
        let $navList;

        beforeEach(() => {
            jest.spyOn(facetedSearch, 'getMoreFacetResults').mockImplementation(() => {});
            jest.spyOn(facetedSearch, 'collapseFacetItems').mockImplementation(() => {});

            $navList = $('#facet-brands');
        });

        it('should get more facet items if they are collapsed when toggled', function() {
            facetedSearch.collapsedFacetItems = ['facet-brands'];
            facetedSearch.toggleFacetItems($navList);

            expect(facetedSearch.getMoreFacetResults).toHaveBeenCalledWith($navList);
        });

        it('should collapse facet items if they are expanded', function() {
            facetedSearch.collapsedFacetItems = [];
            facetedSearch.toggleFacetItems($navList);

            expect(facetedSearch.collapseFacetItems).toHaveBeenCalledWith($navList);
        });
    });

    describe('when location URL is changed', () => {
        let href;

        beforeEach(() => {
            href = document.location.href;

            jest.spyOn(facetedSearch, 'updateView').mockImplementation(() => {});
        });

        afterEach(() => {
            urlUtils.goToUrl('/');
        });

        it('should update view', () => {
            urlUtils.goToUrl('/hello-world');

            expect(facetedSearch.updateView).toHaveBeenCalled();
        });
    });

    describe('when price range form is submitted', () => {
        let event;
        let eventName;
        let currentTarget = '#facet-range-form';

        beforeEach(() => {
            eventName = 'facetedSearch-range-submitted';
            event = {
                preventDefault: jest.fn(),
            };

            jest.spyOn(urlUtils, 'goToUrl').mockImplementation(() => {});
            jest.spyOn(facetedSearch.priceRangeValidator, 'areAll').mockImplementation(() => true);
        });

        it('should set `min_price` and `max_price` query param to corresponding form values if form is valid', () => {
            hooks.emit(eventName, event, currentTarget);

            expect(urlUtils.goToUrl).toHaveBeenCalledWith('/?min_price=0&max_price=100');
        });

        it('should not set `min_price` and `max_price` query param to corresponding form values if form is invalid', () => {
            jest.spyOn(facetedSearch.priceRangeValidator, 'areAll').mockImplementation(() => false);
            hooks.emit(eventName, event);

            expect(urlUtils.goToUrl).not.toHaveBeenCalled();
        });

        it('should prevent default event', () => {
            hooks.emit(eventName, event);

            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('when price range form is submitted with other facets selected', () => {
        let event;
        let eventName;
        let currentTarget;

        beforeEach(() => {
            eventName = 'facetedSearch-range-submitted';
            event = {
                preventDefault: jest.fn(),
            };
            currentTarget = '#facet-range-form-with-other-facets';

            jest.spyOn(urlUtils, 'goToUrl').mockImplementation(() => {});
            jest.spyOn(facetedSearch.priceRangeValidator, 'areAll').mockImplementation(() => true);
        });

        it('send `min_price` and `max_price` query params if form is valid', () => {
            hooks.emit(eventName, event, currentTarget);

            expect(urlUtils.goToUrl).toHaveBeenCalledWith('/?brand[]=item1&brand[]=item2&min_price=0&max_price=50');
        });
    });

    describe('when sort filter is submitted', () => {
        let event;
        let eventName;
        let currentTarget;

        beforeEach(() => {
            eventName = 'sortBy-submitted';
            event = {
                preventDefault: jest.fn(),
            };
            currentTarget = '#facet-sort';

            jest.spyOn(urlUtils, 'goToUrl').mockImplementation(() => {});
        });

        it('should set `sort` query param to the value of selected option', () => {
            hooks.emit(eventName, event, currentTarget);

            expect(urlUtils.goToUrl).toHaveBeenCalledWith('/?sort=featured');
        });

        it('should prevent default event', function() {
            hooks.emit(eventName, event, currentTarget);

            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('when a facet is clicked', () => {
        let event;
        let eventName;
        let currentTarget;

        beforeEach(() => {
            eventName = 'facetedSearch-facet-clicked';
            event = {
                preventDefault: jest.fn(),
            };
            currentTarget = '[href="?brand=item1"]';

            jest.spyOn(urlUtils, 'goToUrl').mockImplementation(() => {});
        });

        it('should change the URL of window to the URL of facet item', () => {
            hooks.emit(eventName, event, currentTarget);

            expect(urlUtils.goToUrl).toHaveBeenCalledWith('?brand=item1');
        });

        it('should prevent default event', function() {
            hooks.emit(eventName, event, currentTarget);

            expect(event.preventDefault).toHaveBeenCalled();
        });
    });
});
