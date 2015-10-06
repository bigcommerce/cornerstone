import PageManager from '../page-manager';
import $ from 'jquery';
import FacetedSearch from './common/faceted-search';

export default class Category extends PageManager {
    constructor() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const requestOptions = {
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

        super();

        this.facetedSearch = new FacetedSearch(requestOptions, function(content) {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }
}
