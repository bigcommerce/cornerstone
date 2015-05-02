import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';
import ko from 'knockout';
import PageManager from '../page-manager';

export default class CurrencySelector extends PageManager {
    constructor() {
        this.viewModel = {
            visible: ko.observable(false)
        };


        this.element = $('[data-model="CurrencySelector"]');
    }

    loaded() {
        if (_.isArray(this.element)) {
            _.forEach(this.element, function (el) {
                ko.applyBindings(this.viewModel, el);
            });
        }
    }


};

