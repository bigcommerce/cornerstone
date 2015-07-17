/*
 Import all product specific js
 */
import $ from 'jquery';
import PageManager from '../page-manager';
import collapsible from './common/collapsible';
import ProductDetails from './common/product-details';

export default class Product extends PageManager {
    constructor() {
        super();
    }

    loaded(next) {
        // Init collapsible
        collapsible();
        new ProductDetails($('.productView'), this.context);

        next();
    }
}
