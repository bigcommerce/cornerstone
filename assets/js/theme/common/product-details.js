/*
 Import all product specific js
 */
import $ from 'jquery';
import utils from 'bigcommerce/stencil-utils';
import 'foundation/js/foundation/foundation';
import 'foundation/js/foundation/foundation.reveal';
import ImageGallery from '../product/image-gallery';
import TextTruncate from '../global/text-truncate';

export default class Product {
    constructor($scope, context) {
        this.$scope = $scope;
        this.context = context;
        this.productOptions();
        this.quantityChange();
        this.addProductToCart();
        this.imageGallery = new ImageGallery($('[data-image-gallery]', this.$scope));
        this.imageGallery.init();
        this.textTruncate = new TextTruncate($('[data-text-truncate]', this.$scope));
        this.textTruncate.init();
    }

    /**
     * Since $productView can be dynamically inserted using render_with,
     * We have to retrieve the respective elements
     *
     * @param $scope
     */
    getViewModel($scope) {
        return {
            $price: $('.productView-price [data-product-price]', $scope),
            $increments: $('.form-field--increments :input', $scope),
            $addToCart: $('#form-action-addToCart', $scope),
            stock: {
                $container: $('.form-field--stock', $scope),
                $input: $('[data-product-stock]', $scope)
            },
            quantity: {
                $text: $('.incrementTotal', $scope),
                $input: $('[name=qty\\[\\]]', $scope)
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
        this.$scope.on('change', '[data-product-options]', (event) => {
            let $target = $(event.target),     // actual element that is clicked
                $ele = $(event.currentTarget), // the element that has the data-tag
                targetVal = $target.val(),     // value of the target
                options = {},
                productId = $('[name="product_id"]', this.$scope).val();

            if (targetVal) {
                options = this.getOptionValues($ele);

                // check inventory when the option has changed
                utils.api.productAttributes.optionChange(options, productId, (err, response) => {
                    let viewModel = this.getViewModel(this.$scope);
                    viewModel.$price.html(response.data.price);

                    if (response.data.image) {
                        let zoomImageUrl = utils.tools.image.getSrc(
                                response.data.image.data,
                                this.context.themeImageSizes.zoom
                            ),
                            mainImageUrl = utils.tools.image.getSrc(
                                response.data.image.data,
                                this.context.themeImageSizes.product
                            );

                        this.imageGallery.setMainImage({
                            mainImageUrl: mainImageUrl,
                            zoomImageUrl: zoomImageUrl
                        });
                    }

                    // if stock view is on (CP settings)
                    if (viewModel.stock.$container.length && response.data.stock) {
                        // if the stock container is hidden, show
                        if (viewModel.stock.$container.is(':hidden')) {
                            viewModel.stock.$container.show();
                        }
                        viewModel.stock.$input.text(response.data.stock);
                    }

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
        this.$scope.on('click', '[data-quantity-change] button', (event) => {
            event.preventDefault();
            let $target = $(event.currentTarget),
                viewModel = this.getViewModel(this.$scope),
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

            let quantity = this.$scope.find('[name=qty\\[\\]]').val(),
                $optionsContainer = this.$scope.find('[data-product-options]'),
                options,
                $modal = $('#modal'),
                $modalContent = $('.modal-content', $modal),
                $modalOverlay = $('.loadingOverlay', $modal),
                $cartCounter = $('.navUser-action .cart-count'),
                productId = $('[name="product_id"]', this.$scope).val();

            options = this.getOptionValues($optionsContainer);

            // add item to cart
            utils.api.cart.itemAdd(productId, quantity, options, (err, response) => {
                let options = {
                    template: 'cart/preview'
                };

                // if there is an error
                if (err) {
                    return alert(err);
                } else if (response.data.error) {
                    return alert(response.data.error);
                }

                // clear the modal
                $modalContent.html('');
                $modalOverlay.show();

                // open modal
                $modal.foundation('reveal', 'open');

                // fetch cart to display in cart preview
                utils.api.cart.getContent(options, (err, response) => {
                    $modalOverlay.hide();
                    $cartCounter.addClass('cart-count--positive');
                    $cartCounter.text(response.data.cart.items.length);
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
                name = $ele.attr('name');

            params[name] = $ele.val();
        });

        return params;
    }
}
