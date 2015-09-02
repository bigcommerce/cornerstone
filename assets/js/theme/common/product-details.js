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
            $wishlistVariation: $('[data-wishlist-add] [name="variation_id"]', $scope),
            stock: {
                $container: $('.form-field--stock', $scope),
                $input: $('[data-product-stock]', $scope)
            },
            $sku: $('[data-product-sku]'),
            quantity: {
                $text: $('.incrementTotal', $scope),
                $input: $('[name=qty\\[\\]]', $scope)
            }
        };
    }

    /**
     *
     * Handle product options changes
     *
     */
    productOptions() {
        utils.hooks.on('product-option-change', (event, changedOption) => {
            let $changedOption = $(changedOption),
                $form = $changedOption.parents('form'),
                productId = $('[name="product_id"]', $form).val();

            // Do not trigger an ajax request if it's a file or if the browser doesn't support FormData
            if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
                return;
            }

            utils.api.productAttributes.optionChange(productId, $form.serialize(), (err, response) => {
                let viewModel = this.getViewModel(this.$scope),
                    $messageBox = $('.productAttributes-message'),
                    data = response.data || {};

                if (data.purchasingMessage) {
                    $('.alertBox-message', $messageBox).text(data.purchasingMessage);
                    $messageBox.show();
                } else {
                    $messageBox.hide();
                }

                viewModel.$price.html(data.price);

                // Set variation_id if it exists for adding to wishlist
                if (response.data.variantId) {
                    viewModel.$wishlistVariation.val(response.data.variantId);
                }

                // If SKU is available
                if (data.sku) {
                    viewModel.$sku.text(data.sku);
                }

                if (data.image) {
                    const zoomImageUrl = utils.tools.image.getSrc(
                        data.image.data,
                        this.context.themeImageSizes.zoom
                    );

                    const mainImageUrl = utils.tools.image.getSrc(
                        data.image.data,
                        this.context.themeImageSizes.product
                    );

                    this.imageGallery.setMainImage({
                        mainImageUrl: mainImageUrl,
                        zoomImageUrl: zoomImageUrl
                    });
                }

                // if stock view is on (CP settings)
                if (viewModel.stock.$container.length && data.stock) {
                    // if the stock container is hidden, show
                    if (viewModel.stock.$container.is(':hidden')) {
                        viewModel.stock.$container.show();
                    }
                    viewModel.stock.$input.text(data.stock);
                }

                if (!data.purchasable || !data.instock) {
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
        const $previewModal = $('#previewModal');

        utils.hooks.on('cart-item-add', (event, form) => {
            const $addToCartBtn = $('#form-action-addToCart', $(event.target));
            let originalBtnVal = $addToCartBtn.val(),
                waitMessage = $addToCartBtn.data('waitMessage');

            // Do not do AJAX if browser doesn't support FormData
            if (window.FormData === undefined) {
                return;
            }

            // Prevent default
            event.preventDefault();

            $addToCartBtn
                .val(waitMessage)
                .prop('disabled', true);

            // Add item to cart
            utils.api.cart.itemAdd(new FormData(form), (err, response) => {
                const errorMessage = err || response.data.error;

                $addToCartBtn
                    .val(originalBtnVal)
                    .prop('disabled', false);

                // Guard statement
                if (errorMessage) {
                    alert(errorMessage);

                    return;
                }

                // Optimistic loading
                this.openCartModal($previewModal);

                // Show modal
                this.populateCartModal($previewModal, response.data.cart_item.hash, ($modalContent) => {
                    // Update cart counter
                    const $body = $('body'),
                        $cartQuantity = $('[data-cart-quantity]', $modalContent),
                        $cartCounter = $('.navUser-action .cart-count'),
                        quantity = $cartQuantity.data('cart-quantity') || 0;

                    $cartCounter.addClass('cart-count--positive');
                    $body.trigger('cart-quantity-update', quantity);
                });
            });
        });
    }

    /**
     * Open cart modal
     */
    openCartModal($modal) {
        $modal.foundation('reveal', 'open');
    }

    /**
     * Close cart modal
     */
    closeCartModal($modal) {
        $modal.foundation('reveal', 'close');
    }

    /**
     * Populate cart modal
     *
     * @param {jQuery} $modal
     * @param {String} cartItemHash
     * @param {Function} onComplete
     */
    populateCartModal($modal, cartItemHash, onComplete) {
        // Define options
        const $modalContent = $('.modal-content', $modal),
            $modalOverlay = $('.loadingOverlay', $modal);

        const options = {
            template: 'cart/preview',
            params: {
                suggest: cartItemHash
            },
            config: {
                cart: {
                    suggestions: {
                        limit: 4
                    }
                }
            }
        };

        // Fetch cart to display in modal
        utils.api.cart.getContent(options, (err, response) => {
            // Insert fetched content into modal
            $modalOverlay.hide();
            $modalContent.html(response);

            onComplete($modalContent);
        });
    }
}
