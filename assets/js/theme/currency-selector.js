import $ from 'jquery';
import ko from 'knockout';
import utils from 'bigcommerce/stencil-utils';

let currencySelectorViewModel = {
    visible: ko.observable(false)
};

utils.events.on('currencySelector-toggle', (event, ele) => {
    let toggled = !currencySelectorViewModel.currencySelector.visible();
    currencySelectorViewModel.currencySelector.visible(toggled);
});

ko.applyBindings(currencySelectorViewModel, $('.currencySelectorView').get(0));

export default function (window) {

}
