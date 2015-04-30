import $ from 'jquery';
import ko from 'knockout';
import PageManager from '../page-manager';
import utils from 'bigcommerce/stencil-utils';

export default class CurrencySelector extends PageManager {
    constructor() {
        this.currencySelectorViewModel = {
            currencySelector: {
                visible: ko.observable(false)
            }
        };
    }

    loaded() {
        ko.applyBindings(this.currencySelectorViewModel);

        utils.events.on('currencySelector-toggle', (event, ele) => {
            let toggled = !this.currencySelectorViewModel.currencySelector.visible();
            this.currencySelectorViewModel.currencySelector.visible(toggled);
        });

    }
}

