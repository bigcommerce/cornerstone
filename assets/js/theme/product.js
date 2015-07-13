/*
 Import all product specific js
 */
import PageManager from '../page-manager';
import collapsible from './common/collapsible';

export default class Product extends PageManager {
    constructor() {
        super();
    }

    loaded(next) {
        // Init collapsible
        collapsible();

        next();
    }
}
