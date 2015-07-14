/*
 Import all product specific js
 */
import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.reveal';
import imageGallery from '../product/image-gallery';

export default class Product {
    constructor() {

        this.productOptions();
        this.quantityChange();
        this.addProductToCart();
        this.setImageGallery();
    }

    /**
     * Since $productView can be dynamically inserted using render_with,
     * We have to retrieve the respective elements
     *
     * @param $productView
     */
    getViewModel($productView) {
        return {
            $price: $('.productView-price [data-product-price]', $productView),
            $increments: $('.form-field--increments :input', $productView),
            $addToCart: $('#form-action-addToCart', $productView),
            quantity: {
                $text: $('.incrementTotal', $productView),
                $input: $('[name=qty\\[\\]]', $productView)
            }
        }
    }

    /**
     *
     * Handle product options changes
     *
     */
    productOptions() {
        // product options
        $('body').on('change', '[data-product-options]', (event) => {
            let $target = $(event.target),     // actual element that is clicked
                $ele = $(event.currentTarget), // the element that has the data-tag
                $productView = $target.parents('.productView'), // find the productView in context of what was clicked.
                targetVal = $target.val(),     // value of the target
                options = {},
                productId = $('[name="product_id"]', $productView).val();

            if (targetVal) {
                options = this.getOptionValues($ele);

                // check inventory when the option has changed
                utils.api.productAttributes.optionChange(options, productId, (err, response) => {
                    let viewModel = this.getViewModel($productView);
                    viewModel.$price.html(response.data.price);

                    if (!response.data.purchasable || !response.data.instock) {
                        viewModel.$addToCart.prop('disabled', true);
                        viewModel.$increments.prop('disabled', true);
                    } else {
                        viewModel.$addToCart.prop('disabled', false);
                        viewModel.$increments.prop('disabled', false);
                    }
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
        $('body').on('click', '[data-quantity-change] button', (event) => {
            event.preventDefault();
            let $target = $(event.currentTarget),
                $productView = $target.parents('.productView'),
                viewModel = this.getViewModel($productView),
                qty = viewModel.quantity.$input.val();

            if ($target.data('action') === 'inc') {
                qty++;
            } else if (qty > 1) {
                qty--;
            }

            // update hidden input
            viewModel.quantity.$input.val(qty);
            // update text
            viewModel.quantity.$text.text(qty);
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

            let $target = $(event.currentTarget),
                $productView = $target.parents('.productView'),
                quantity = $productView.find('[name=qty\\[\\]]').val(),
                $optionsContainer = $productView.find('[data-product-options]'),
                options,
                $modal = $('#modal'),
                $modalContent = $('.modal-content', $modal),
                $modalOverlay = $('.loadingOverlay', $modal),
                productId = $('[name="product_id"]', $productView).val();

            options = this.getOptionValues($optionsContainer);

            // clear the modal
            $modalContent.html('');
            $modalOverlay.show();

            // open modal
            $modal.foundation('reveal', 'open');

            // add item to cart
            utils.api.cart.itemAdd(productId, quantity, options, (err, response) => {
                let options = {
                    template: 'cart/preview'
                };

                // if there is an error
                if (err) {
                    $modal.foundation('reveal', 'close');
                    return alert(err);
                } else if (response.data.error) {
                    $modal.foundation('reveal', 'close');
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

    setImageGallery() {
        let $gallery = $('[data-image-gallery]');

        if ($gallery.length) {
            new imageGallery($gallery);
        }
    }
}
