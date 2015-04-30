import PageManager from '../page-manager';

export default class Errors extends PageManager{
    constructor() {
    }

    loaded(){
        ko.applyBindings(currencySelectorViewModel);

        utils.events.on('currencySelector-toggle', (event, ele) => {
            let toggled = !currencySelectorViewModel.currencySelector.visible();
            currencySelectorViewModel.currencySelector.visible(toggled);
        });

    }
}
