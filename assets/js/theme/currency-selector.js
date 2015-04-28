import utils from 'bigcommerce/stencil-utils';
import ko from 'knockout';

let currencySelectorViewModel = {
    currencySelector: {
        visible: ko.observable(false)
    }
};

ko.applyBindings(currencySelectorViewModel);

utils.events.on('currencySelector-toggle', (event, ele) => {
    let toggled = !currencySelectorViewModel.currencySelector.visible();
    currencySelectorViewModel.currencySelector.visible(toggled);
});
