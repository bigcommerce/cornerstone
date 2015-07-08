/*
 Import all product specific js
 */
import $ from 'jquery';
import ko from 'knockout';
import PageManager from '../page-manager';
import utils from 'bigcommerce/stencil-utils';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.reveal';

export default class Product extends PageManager {
    constructor() {
        super();

        this.productId = $('[name="product_id"]').val();
        this.$productView = $('.productView');

        this.viewModel = { // The knockout.js view model
            quantity: ko.observable(1),
            price: ko.observable(),
            sku: ko.observable(),
            instock: ko.observable(true),
            purchasable: ko.observable(true),
            canAddToCart: ko.pureComputed(() => {
                return this.viewModel.instock() && this.viewModel.purchasable();
            })
        };
    }

    loaded(next) {
        ko.applyBindings(this.viewModel, this.$productView.get(0));

        this.productOptions();

        this.quantityChange();

        this.addProductToCart();

        next();
    }

    /**
     *
     * Handle product options changes
     *
     */
    productOptions() {
        // product options
        $('body').on('change', '.product-options', (event) => {
            let $target = $(event.target),     // actual element that is clicked
                $ele = $(event.currentTarget), // the element that has the data-tag
                targetVal = $target.val(),     // value of the target
                options = {};

            if (targetVal) {
                options = this.getOptionValues($ele);

                // check inventory when the option has changed
                utils.api.productAttributes.optionChange(options, this.productId, (err, response) => {
                    this.viewModel.price(response.data.price);
                    this.viewModel.sku(response.data.sku);
                    this.viewModel.instock(response.data.instock);
                    this.viewModel.purchasable(response.data.purchasable);
                });
            }
        });
    }

    /**
     *
     * Handle action when the shopper clicks on + / - for quantity
     *
     */
    quantityChange() {
        $('#product-quantity').on('click', 'button', (event) => {
            event.preventDefault();
            let qty = this.viewModel.quantity(),
                $target = $(event.target);

            if ($target.data('action') === 'inc') {
                qty++;
            } else if (qty > 1) {
                qty--;
            }

            this.viewModel.quantity(qty);
        });
    }

    /**
     *
     * Add a product to cart
     *
     */
    addProductToCart() {
        utils.hooks.on('cart-item-add', (event) => {
            event.preventDefault();

            let quantity = this.$productView.find('[name=qty\\[\\]]').val(),
                $optionsContainer = this.$productView.find('.product-options'),
                options,
                $modal = $('#modal'),
                $modalContent = $('.modal-content', $modal),
                $modalOverlay = $('.loadingOverlay', $modal);

            options = this.getOptionValues($optionsContainer);
            
            // clear the modal
            $modalContent.html('');
            $modalOverlay.show();

            // open modal
            $modal.foundation('reveal', 'open');

            // add item to cart
            utils.api.cart.itemAdd(this.productId, quantity, options, (err, response) => {
                let options = {
                    template: 'cart/preview'
                };

                // if there is an error
                if (err) {
                    return alert(err);
                } else if (response.data.error) {
                    return alert(response.data.error);
                }

                // fetch cart to display in cart preview
                utils.api.cart.getContent(options, (err, response) => {
                    $modalOverlay.hide();
                    $modalContent.html(response.content);
                });
            });
        });
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
