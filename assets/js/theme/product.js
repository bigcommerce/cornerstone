/*
 Import all product specific js
 */
import utils from 'bigcommerce/stencil-utils'
import ko from 'knockout';
import PageManager from '../page-manager';
let internals = {};

export default class Product extends PageManager {
    loaded(next) {
        let viewModel = { // The knockout.js view model
                price: ko.observable(),
                sku: ko.observable(),
                instock: ko.observable(true),
                purchasable: ko.observable(true),
                canAddToCart: ko.pureComputed(() => {
                    let self = viewModel;
                    return self.instock() && self.purchasable();
                })
            };

        ko.applyBindings(viewModel, $('.productView').get(0));

        utils.events.on('product-options-change', (event, ele) => {
            let $target = $(event.target), // actual element that is clicked
                $ele = $(ele),             // the element that has the data-tag
                targetVal = $target.val(); // value of the target

            if (targetVal) {
                let productId = $('[name="product_id"]').val();

                // check inventory when the option has changed
                utils.remote.productAttributes.optionChange($ele, productId, (err, data) => {
                    viewModel.price(data.price);
                    viewModel.sku(data.sku);
                    viewModel.instock(data.instock);
                    viewModel.purchasable(data.purchasable);
                });
            }
        });

        next();
    }
}
