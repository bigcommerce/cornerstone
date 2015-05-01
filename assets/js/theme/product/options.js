import utils from 'bigcommerce/stencil-utils'
import $ from 'jquery';
import ProductView from './views/product';

export default function () {
    let productView = ProductView();
    utils.events.on('product-options-change', (event, ele) => {
        let $target = $(event.target), // actual element that is clicked
            $ele = $(ele),             // the element that has the data-tag
            targetVal = $target.val(); // value of the target

        if (targetVal) {
            let productId = document.querySelector('[name="product_id"]').value;

            // check inventory when the option has changed
            utils.remote.productAttributes.optionChange($ele, productId, (err, data) => {
                productView.price(data.price);
                productView.sku(data.sku);
                productView.instock(data.instock);
                productView.purchasable(data.purchasable);
            });
        }
    });
}
