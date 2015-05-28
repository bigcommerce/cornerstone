import PageManager from '../page-manager';
import FacetedSearch from './common/faceted-search';

export default class Category extends PageManager {
    constructor() {
        super();

        FacetedSearch('components/category/product-listing');
    }
}
