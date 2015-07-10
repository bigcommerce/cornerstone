import PageManager from '../page-manager';
import FacetedSearch from './common/faceted-search';

export default class Category extends PageManager {
    constructor() {
        let $productListingContainer = $('#product-listing-container'),
            $facetedSearchContainer = $('#faceted-search-container');

        super();

        new FacetedSearch({
            productListing: 'category/product-listing',
            sidebar: 'category/sidebar'
        }, function(content) {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);
        });
    }
}
