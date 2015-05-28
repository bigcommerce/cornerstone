import PageManager from '../page-manager';
import FacetedSearch from './common/faceted-search';

export default class Brand extends PageManager {
    constructor() {
        super();

        FacetedSearch('components/brand/product-listing');
    }
}
