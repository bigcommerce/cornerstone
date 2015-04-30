import _ from 'lodash';
import utils from 'bigcommerce/stencil-utils';
import ko from 'knockout';
import PageManager from '../../page-manager';

export default function () {
    let viewModel = {
            visible: ko.observable(false)
        },
        element = $('[data-model="CurrencySelector"]');

    _.forEach(element, function (el) {
        ko.applyBindings(viewModel, el);
    });
};

