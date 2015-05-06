/*
 Import all product specific js
 */
import utils from 'bigcommerce/stencil-utils'
import ko from 'knockout';
import PageManager from '../page-manager';
let internals = {};

export default class Product extends PageManager {
    constructor() {
        super();

        let productViewModel = { // The knockout.js view model
                price: ko.observable(),
                sku: ko.observable(),
                instock: ko.observable(true),
                purchasable: ko.observable(true),
                canAddToCart: ko.pureComputed(() => {
                    let self = productViewModel;
                    return self.instock() && self.purchasable();
                })
            };

        ko.applyBindings(productViewModel, $('.productView').get(0));

        internals.ProductOptions = function () {
            utils.events.on('product-options-change', (event, ele) => {
                let $target = $(event.target), // actual element that is clicked
                    $ele = $(ele),             // the element that has the data-tag
                    targetVal = $target.val(); // value of the target

                if (targetVal) {
                    let productId = document.querySelector('[name="product_id"]').value;

                    // check inventory when the option has changed
                    utils.remote.productAttributes.optionChange($ele, productId, (err, data) => {
                        productViewModel.price(data.price);
                        productViewModel.sku(data.sku);
                        productViewModel.instock(data.instock);
                        productViewModel.purchasable(data.purchasable);
                    });
                }
            });
        };
    }

    loaded(next) {
        internals.ProductOptions();
        next();
    }
}
