import PageManager from '../page-manager';
import stateCountry from './common/state-country'

export default class Account extends PageManager {
    constructor() {
        super();
    }

    loaded(next) {
        let $stateElement = $('[data-label="State/Province"]');

        if ($stateElement){
            stateCountry($stateElement);
        }

        next();
    }
}
