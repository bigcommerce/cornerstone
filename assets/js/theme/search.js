import PageManager from '../page-manager';
import FacetedSearch from './common/faceted-search';

export default class Search extends PageManager {
    constructor() {
        let $productListingContainer = $('#product-listing-container'),
            $facetedSearchContainer = $('#faceted-search-container');

        super();

        FacetedSearch({
            productListing: 'search/product-listing',
            sidebar: 'search/sidebar'
        }, function(content) {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);
        });
    }
}
