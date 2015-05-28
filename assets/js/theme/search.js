import PageManager from '../page-manager';
import FacetedSearch from './common/faceted-search';

export default class Search extends PageManager {
    constructor() {
        super();

        FacetedSearch('components/search/product-listing');
    }
}
