import utils from 'bigcommerce/stencil-utils';
import ko from 'knockout';

let currencySelectorViewModel = {
    visible: ko.observable(false)
};

utils.events.on('currencySelector-toggle', (event, ele) => {
    let toggled = !currencySelectorViewModel.currencySelector.visible();
    currencySelectorViewModel.currencySelector.visible(toggled);
});

export { currencySelectorViewModel as currencySelectorView };
export default function (window) {

}
