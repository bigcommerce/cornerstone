import PageManager from '../page-manager';
import FacetedSearch from './common/faceted-search';

export default class Brand extends PageManager {
    constructor() {
        let $productListingContainer = $('#product-listing-container'),
            $facetedSearchContainer = $('#faceted-search-container');

        super();

        FacetedSearch({
            productListing: 'brand/product-listing',
            sidebar: 'brand/sidebar'
        }, function(content) {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);
        });
    }
}
