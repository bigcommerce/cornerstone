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
            $sku: $('[data-product-sku]'),
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
        utils.hooks.on('product-option-change', (event, changedOption) => {
            var $changedOption = $(changedOption),
                $form = $changedOption.parents('form').clone(),
                productId = $('[name="product_id"]', $form).val();

            // Do not trigger an ajax request if it's a file or if the browser doesn't support FormData
            if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
                return;
            }

            // Don't want to send file data along because it's not needed to determine
            // the outcome of product option rules
            $form.find('input[type="file"]').remove();

            utils.api.productAttributes.optionChange(productId, new FormData($form[0]), (err, response) => {
                let viewModel = this.getViewModel(this.$scope);

                viewModel.$price.html(response.data.price);

                // If SKU is available
                if (response.data.sku) {
                    viewModel.$sku.text(response.data.sku);
                }

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
        utils.hooks.on('cart-item-add', (event, form) => {

            // Do not do AJAX if browser doesn't support FormData
            if (window.FormData === undefined) {
                return;
            }

            event.preventDefault();

            let $modal = $('#modal'),
                $modalContent = $('.modal-content', $modal),
                $modalOverlay = $('.loadingOverlay', $modal),
                $cartCounter = $('.navUser-action .cart-count');

            // add item to cart
            utils.api.cart.itemAdd(new FormData(form), (err, response) => {
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
                    let quantity;

                    $modalOverlay.hide();
                    $cartCounter.addClass('cart-count--positive');
                    $modalContent.html(response);

                    quantity = $('#cart-preview', $modalContent).data('cart-items-length') || 0;

                    $cartCounter.text(quantity);
                });
            });
        });
    }
}
