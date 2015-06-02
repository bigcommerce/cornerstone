import $ from 'jquery';
import PageManager from '../page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import navigation from './global/navigation';

export default class Global extends PageManager {
    constructor() {
        super();
    }

    /**
     * You can wrap the execution in this method with an asynchronous function map using the async library
     * if your global modules need async callback handling.
     * @param next
     */
    loaded(next) {
        quickSearch();
        currencySelector();
        navigation();
        next();
    }
}
