import PageManager from '../page-manager';
import FacetedSearch from './common/faceted-search';

export default class Category extends PageManager {
    constructor() {
        let $productListingContainer = $('#product-listing-container'),
            $facetedSearchContainer = $('#faceted-search-container'),
            requestOptions = {
                config: {
                    category: {
                        shop_by_price: true
                    }
                },
                templates: {
                    productListing: 'category/product-listing',
                    sidebar: 'category/sidebar'
                }
            };

        super();

        new FacetedSearch(requestOptions, function(content) {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);
        });
    }
}
