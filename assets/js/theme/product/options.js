import utils from 'bigcommerce/stencil-utils'
import $ from 'jquery';
import ProductView from './views/product';

utils.events.on('product-options-change', (event, ele) => {
    let $target = $(event.target), // actual element that is clicked
        $ele = $(ele),             // the element that has the data-tag
        targetVal = $target.val(); // value of the target

    if (targetVal) {
        // TODO: extract this somehow without relying on jQuery
        let productId = $('[name=product_id]').val();

        // check inventory when the option has changed
        utils.remote.productAttributes.optionChange($ele, productId, (err, data) => {
            ProductView.price(data.price);
            ProductView.sku(data.sku);
            ProductView.canAddToCart(data.instock, data.purchasable);
        });
    }
});

export { ProductView };
export default function (window) {

}
