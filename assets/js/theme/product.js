/*
 Import all product specific js
 */
import $ from 'jquery';
import ko from 'knockout';
import PageManager from '../page-manager';
import utils from 'bigcommerce/stencil-utils'

export default class Product extends PageManager {
    constructor() {
        super();

        this.productId = $('[name="product_id"]').val();
        this.$productView = $('.productView');
    }

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

        ko.applyBindings(viewModel, this.$productView.get(0));

        // product options
        $('body').on('change', '#product-options', (event) => {
            let $target = $(event.target),     // actual element that is clicked
                $ele = $(event.currentTarget), // the element that has the data-tag
                targetVal = $target.val(),     // value of the target
                options = {};

            if (targetVal) {
                options = this.getOptionValues($ele);

                // check inventory when the option has changed
                utils.productAttributes.optionChange(options, this.productId, (err, data) => {
                    viewModel.price(data.price);
                    viewModel.sku(data.sku);
                    viewModel.instock(data.instock);
                    viewModel.purchasable(data.purchasable);
                });
            }
        });

        utils.hooks.on('cart-item-add', (event, ele) => {
            event.preventDefault();

            let quantity = this.$productView.find('[data-product-quantity]').val(),
                $optionsContainer = this.$productView.find('#product-options'),
                options;

            options = this.getOptionValues($optionsContainer);

            // add item to cart
            utils.cart.itemAdd(this.productId, quantity, options, (err, data) => {
                // if there is an error
                if (err || data.error) {
                    // TODO: display error
                    return;
                }

                // fetch cart to display in cart preview
                utils.cart.getContent({render_with: 'cart/preview'}, (err, content) => {
                    $('[data-cart-preview]').html(content);
                });
            });
        });

        next();
    }

    /**
     *
     * Get product options
     *
     * @param {jQuery} $container
     * @returns Object
     */
    getOptionValues($container) {
        // What does this query mean?
        //
        // :input:radio:checked
        //      Get all radios that are checked (since they are grouped together by name).
        //      If the query is just :input alone, it will return all radios (even the ones that aren't selected).
        //
        // :input:not(:radio)
        //      This is to retrieve all text, hidden, dropdown fields that don't have "groups".
        let $optionValues = $container.find(':input:radio:checked, :input:not(:radio)'),
            params = {};

        // iterate over values
        $optionValues.each((index, ele) => {
            let $ele = $(ele),
                name = $ele.attr('name'),
                val = $ele.val();

            params[name] = val;
        });

        return params;
    }
}
