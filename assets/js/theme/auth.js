import PageManager from '../page-manager';
import stateCountry from './common/state-country'

export default class Auth extends PageManager {
    constructor() {
        super();
    }

    /**
     * Request is made in this function to the remote endpoint and pulls back the states for country.
     * @param next
     */
    loaded(next) {
        let $stateElement = $('[data-label="State/Province"]');

        if ($stateElement){
            stateCountry($stateElement);
        }

        next();
    }
}
