import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import swal from 'sweetalert2';
import _ from 'lodash';
import modalFactory, { showAlertModal } from '../global/modal';

export default function(context) {
    const relate_tab = "#tab-related";
    const previewModal = modalFactory('#previewModal')[0];

    // check custom field fbt
    showFBT();

    $(document).on('click', '.themvale-fbt-toggle-options', function() {
        if ($(this).next().is(':visible') == false) {
            $(this).next().slideDown();
        } else {
            $(this).next().slideUp();
        }
    });

    $(document).on('change', '.themvale-fbt-detail-checkbox', function() {
        var id = $(this).attr('id').replace('fbt_product', '');
        if ($(this).is(':checked') == false) {
            $('.themvale-fbt-product-item[data-product-id="' + id + '"]').removeClass('isChecked');
            $(this).parents('form').find('.themvale-fbt-detail-options').slideUp();
        } else {
            $('.themvale-fbt-product-item[data-product-id="' + id + '"]').addClass('isChecked');
        }
        totalPrice();
    });

    $(document).on('click', '#themvale-fbt-addAll', function(event) {
        if ($('#themvale-fbt-addAll').hasClass('disabled')) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            const $form = $('form', $('#themvale-fbt'));
            var arrPro = new Array();
            $('.themvale-fbt-detail-checkbox').each(function(i, val) {
                if ($(val).is(':checked')) {
                    arrPro.push(i);
                }
            });
            
            var check = false;

            check = checkMainProduct();

            if (check && arrPro.length > 0) {
                check = checkProduct($form, arrPro);
            }
            

            if (check) {
                $('#themvale-fbt .loadingOverlay').show();
                addMainProductToCart($form, arrPro);
            } else {
                swal({
                    text: 'Please make sure all options have been filled in.',
                    type: 'warning',
                });
            }

            event.preventDefault();
        }
    });

    function checkAddToCartButton() {
        var arrPro = new Array();
        $('.themvale-fbt-detail-checkbox').each(function(i, val) {
            if ($(val).is(':checked')) {
                arrPro.push(i);
            }
        });
        var check;
        if($('#form-action-addToCart').is(":disabled")) {
            check = false;
        } else {
            check = true;
        }

        if ((check == false)) {
            $('#themvale-fbt-addAll').addClass('disabled');
        } else {
            $('#themvale-fbt-addAll').removeClass('disabled');
        }
    }

    function showFBT() {
        // related product
        const options = {
                template: {
                    item: 'themevale/fbt-item',
                    options: 'themevale/fbt-options',
                },
            };

        if ($('.productView-info-name.fbt').length > 0) {
            var num = 0;
            var list = [];

            $(relate_tab + ' .card').each(function(i, val) {
                    list.push( {i:i, data: ""} );
                    
                    var pId = $(val).data('product-id');
                    if (pId != undefined) {
                        utils.api.product.getById(pId, options, (err, response) => {
                            if (err) {
                                return '';
                            }
                            list.forEach(function(element) {
                                if(element.i == i){
                                    element.data = response;
                                }
                            });
                            
                            num++;
                            if(num == $(relate_tab + ' .card').length)
                                showList(list);
                     
                        });
                    }
            });
        } else if ($('.productView-info-name.fbt-product').length > 0) {
            var num = 0;
            var list = [];

            $('.productView-info-value.fbt-product').each(function(i) {
                list.push( {i:i, data: ""} );
                if (!isNaN(Number($(this).text()))) {
                    var productId = Number($(this).text())
                    utils.api.product.getById(productId, options, (err, response) => {
                        if (err) {
                            return '';
                        }
                        list.forEach(function(element) {
                            if(element.i == i){
                                element.data = response;
                            }
                        });
                        num++;
                        if(num == $('.productView-info-value.fbt-product').length)
                            showList(list);
                    });
                } else {
                    utils.api.getPage($(this).text(), options, (err, response) => {
                        if (err) {
                            return '';
                        }
                        list.forEach(function(element) {
                            if(element.i == i){
                                element.data = response;
                            }
                        });
                        num++;
                        if(num == $('.productView-info-value.fbt-product').length)
                            showList(list);
          
                    });
                }
            });
        } else {
            $('#themvale-fbt').remove();
            $("#form-action-addToCart").show();
            $(".form-action.addToCart").removeClass('has-extra-option');
        }
    }

    function showList(list){
        list.forEach(function(element) {
            var response = element.data;
            $('#themvale-fbt .themvale-fbt-product-list').append(response.item);
            if (response.options.trim() != "") {
                var pId = $(response.item).data('product-id');
                const $form = $('#themvale-fbt .themvale-fbt-product-list .themvale-fbt-product-item[data-product-id="' + pId + '"] form');
                $form.append(response.options);
                const $productOptionsElement = $('[data-fbt-option-change]', $form);
                const hasOptions = $productOptionsElement.html().trim().length;
                const hasDefaultOptions = $(response.options).find('[data-default]').length;
                if ( hasDefaultOptions && hasOptions) {
                    utils.api.productAttributes.optionChange(pId, $form.serialize(), 'products/bulk-discount-rates', (err, response) => {
                        const attributesData = response.data || {};
                        const attributesContent = response.content || {};
                        updateProductAttributes($form, attributesData);
                        if (hasDefaultOptions) {
                            updateView($form, attributesData, attributesContent);
                        } else {
                            updateDefaultAttributesForOOS(attributesData);
                        }
                    });
                }
            }
        });
        $('#themvale-fbt').show();
        $("#form-action-addToCart").hide();
        $(".form-action.addToCart").addClass('has-extra-option');
        productOptions();
        $('#themvale-fbt').after('<div class="themvale-fbt-total fbt__total">\
          <p class="themevale-text-price"><span>Total:</span> <span class="themvale-fbt-total-price" id="themvale-fbt-totalPrice"></span></p>\
          <a class="button button--primary button--large themvale-fbt-total-button" id="themvale-fbt-addAll" href="#">Add to Cart</a>\
        </div>');

        checkAddToCartButton();

        slick_slider();
        totalPrice();

        const $previewFbtDetailOptions = $('.themvale-fbt-detail-options[data-fbt-option-change]');
        $previewFbtDetailOptions.mCustomScrollbar('destroy');
        if ($previewFbtDetailOptions.length) {
            $previewFbtDetailOptions.mCustomScrollbar({
                scrollInertia: 400,
                mouseWheel:true
            });
        }
        $('.themvale-fbt-product-list .themvale-fbt-product-item').each(function(index) {
            var title = $(this).find('.themvale-fbt-detail-label .card-title').text().trim();
            if (title.length > 30) {
              var truncated = title.substring(0, 30).split(" ").slice(0, -1).join(" ") + "…";
              $(this).find('.themvale-fbt-detail-label .card-title').text(truncated);
            }
        });
    }

    function slick_slider() {
        $('.themvale-fbt-product-list').slick({
            dots: true,
            arrows: false,
            slidesToShow: 2,
            slidesToScroll: 2,
            mobileFirst: true,
            infinite: false,
            responsive: [
                {
                    breakpoint: 1441,
                    settings: {
                        slidesToScroll: 3,
                        slidesToShow: 3,
                        dots: true,
                        arrows: false
                    }
                },
                {
                    breakpoint: 1025,
                    settings: {
                        slidesToScroll: 2,
                        slidesToShow: 2,
                        dots: true,
                        arrows: false
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToScroll: 2,
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 551,
                    settings: {
                        slidesToScroll: 2,
                        slidesToShow: 2
                    }
                }
            ]
        });

        if ($('.themvale-fbt-product-list .slick-dots').length) {
            if ($('.themvale-fbt-product-list .slick-dots li').length <= 1) {
                $('.themvale-fbt-product-list').addClass('no-dots');
            }
        }
    }

    function checkProduct(form, arrPro) {
        var check = true;

        for (var i = 0; i < arrPro.length; i++) {
            var k = arrPro[i];
            var $form = $(form[k]);
            
            if ($form.find('[data-fbt-option-change]').length) {
                check = checkBeforeAdd($form);
                if (check == false)
                    return false;
            }
        }
        return check;
    }

    function checkBeforeAdd($attributes) {
        var check = true;
        $attributes.find('input:text, input:password, input:file, textarea').each(function() {

            if (!$(this).prop('required')) {} else {
                if ($(this).val()) {} else {
                    $(this).focus();
                    check = false;
                }
            }
        });

        $attributes.find('select').each(function() {

            if (!$(this).prop('required')) {

            } else {
                if ($(this).val()) {} else {
                    $(this).focus();
                    check = false;
                }
            }
        });

        var att = "";
        $attributes.find('input:radio, input:checkbox').each(function() {
            if (att != $(this).attr("name")) {

                att = $(this).attr("name");
                if (!$(this).prop('required')) {
                    if ($(this).attr("type") == "checkbox") {
                        if ($("[name='" + att + "']:checked").val()) {}
                    }
                    if ($(this).attr("type") == "radio") {
                        if ($("[name='" + att + "']:checked").val()) {}
                    }
                } else {
                    if ($(this).attr("type") == "checkbox") {
                        if ($("[name='" + att + "']:checked").val()) {} else {
                            check = false;
                        }
                    }
                    if ($(this).attr("type") == "radio") {
                        if ($("[name='" + att + "']:checked").val()) {} else {
                            check = false;
                        }
                    }
                }
            }
        });

        return check;
    }

    function checkMainProduct(){
        var check = true;
        const $form = $('form[data-cart-item-add]', $('.productView'));
        
        if ($form.find('[data-product-option-change]').length) {
            check = checkBeforeAdd($form.find('[data-product-option-change]'));
        }
        return check;
    }
    function addMainProductToCart(form, arrP){
        if (window.FormData === undefined) {
            return;
        }

        const $form = $('form[data-cart-item-add]', $('.productView'));
        // Add item to cart
        utils.api.cart.itemAdd(filterEmptyFilesFromForm(new FormData( $form[0] ) ), (err, response) => {
            const errorMessage = err || response.data.error;
            $('#themvale-fbt .loadingOverlay').hide();

            // Guard statement
            if (errorMessage) {
                // Strip the HTML from the error message
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;
                return showAlertModal(tmp.textContent || tmp.innerText);
            }
            
            if ( arrP.length == 0 ) {
                const loadingClass = 'is-loading';
                const $cart = $('[data-cart-preview]');
                const $cartDropdown = $('.dropdown-cart');
                const $cartLoading = $('<div class="loadingOverlay"></div>');
                const options = {
                    template: 'common/cart-preview',
                };
                $cartDropdown
                    .addClass(loadingClass)
                    .html($cartLoading);
                $cartLoading
                    .show();
                utils.api.cart.getContent(options, (err, response) => {
                    $cartDropdown
                        .removeClass(loadingClass)
                        .html(response);
                    $cartLoading
                        .hide();

                    const $previewCartList = $('.previewCartList');
                    $previewCartList.mCustomScrollbar('destroy');
                    if ($previewCartList.length) {
                        $previewCartList.mCustomScrollbar({
                            scrollInertia: 400
                        });
                    }
                });

                updateCartContent(previewModal, response.data.cart_item.id);
                
                if ($(window).width() > 1024) {
                    $('body').addClass('themevale_open_cart');
                    $('.wrapper-top-cart .cart-icon').addClass('is-open');
                } else {
                    $('body').addClass('themevale_open-Cart');
                }

                return;
            }
            addToCart(form, 0, arrP);
        });
    }

    function addToCart(form, i, arrP) {

        if (i >= arrP.length) {
            window.location = '/cart.php';
            return;
        }

        if (window.FormData === undefined) {
            return;
        }
        var k = arrP[i];

        // Add item to cart
        utils.api.cart.itemAdd(filterEmptyFilesFromForm(new FormData(form[k])), (err, response) => {

            const errorMessage = err || response.data.error;

            $('#themvale-fbt .loadingOverlay').hide();
            // Guard statement
            if (errorMessage) {
                // Strip the HTML from the error message
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;
               alert(tmp.textContent || tmp.innerText);
            }
            i++;
            if (i >= arrP.length) {
                const loadingClass = 'is-loading';
                const $cart = $('[data-cart-preview]');
                const $cartDropdown = $('.dropdown-cart');
                const $cartLoading = $('<div class="loadingOverlay"></div>');

                const options = {
                    template: 'common/cart-preview',
                };
                $cartDropdown
                    .addClass(loadingClass)
                    .html($cartLoading);
                $cartLoading
                    .show();
                utils.api.cart.getContent(options, (err, response) => {
                    $cartDropdown
                        .removeClass(loadingClass)
                        .html(response);
                    $cartLoading
                        .hide();

                    const $previewCartList = $('.previewCartList');
                    $previewCartList.mCustomScrollbar('destroy');
                    if ($previewCartList.length) {
                        $previewCartList.mCustomScrollbar({
                            scrollInertia: 400
                        });
                    }
                    const quantity = $('#cart-preview-dropdown .previewCart .qty').data('cart-quantity');
                    $('.wrapper-top-cart .cart-icon .cart-quantity').text(quantity);
                    if ($(window).width() > 1024) {
                        $('body').addClass('themevale_open_cart');
                        $('.wrapper-top-cart .cart-icon').addClass('is-open');
                    } else {
                        $('body').addClass('themevale_open-Cart');
                    }
                });
                
                return;
            }
            addToCart(form, i, arrP);
            
        });
    }
    
    function updateCartContent(modal, cartItemId, onComplete) {
        getCartContent(cartItemId, (err, response) => {
            if (err) {
                return;
            }

            modal.updateContent(response);

            // Update cart counter
            const $body = $('body');
            const $cartQuantity = $('[data-cart-quantity]', modal.$content);
            const $cartCounter = $('.navUser-action .cart-count');
            const quantity = $cartQuantity.data('cartQuantity') || 0;

            $cartCounter.addClass('cart-count--positive');
            $body.trigger('cart-quantity-update', quantity);

            if (onComplete) {
                onComplete(response);
            }
        });
    }

    function getCartContent(cartItemId, onComplete) {
        const options = {
            template: 'cart/preview',
            params: {
                suggest: cartItemId,
            },
            config: {
                cart: {
                    suggestions: {
                        limit: 4,
                    },
                },
            },
        };

        utils.api.cart.getContent(options, onComplete);
    }

    function totalPrice() {
        var total = 0;
        var pos = 0;
        var symbol = "$";
        $('.themvale-fbt-product-item.isChecked').each(function(i, val) {
            if ($(val).find('.price-section .price.price--withTax').length)
                var currency = $(val).find('.price-section .price.price--withTax').text();
            else
                var currency = $(val).find('.price-section .price.price--withoutTax').text();
            var price = parseFloat(currency.replace(/[^0-9.-]+/g, ""));
            var s = currency.replace(parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), "");
            if (isNaN(parseFloat(s.replace(/[^0-9.-]+/g, ""))))
                symbol = s;
            if (currency.indexOf(symbol) != -1)
                pos = currency.indexOf(symbol);
            total = total + price;
        });
        total = parseFloat(total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (pos == 0)
            total = symbol + total;
        else
            total = total + symbol;
        $('#themvale-fbt-totalPrice').html(total);
    }

    function productOptions() {
        totalPrice();
        const $form = $('form', $(document));

        const $productOptionsElement = $('[data-fbt-option-change]', $form);
        $(document).on('change', $productOptionsElement, event => {
            productOptionsChanged(event);
        });

        $(document).on('click', '.close-options', function() {
            $(this).parents('.themvale-fbt-detail-options[data-fbt-option-change]').slideUp();
        });
    }

    function productOptionsChanged(event) {
        const $changedOption = $(event.target);
        const $form = $changedOption.parents('form');
        const productId = $('[name="product_id"]', $form).val();
        // Do not trigger an ajax request if it's a file or if the browser doesn't support FormData
        if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
            return;
        }
        if ($changedOption.attr('id') === 'fbt_product' + productId) {
            return;
        }
        
        utils.api.productAttributes.optionChange(productId, $form.serialize(), 'products/bulk-discount-rates', (err, response) => {
            const productAttributesData = response.data || {};
            const productAttributesContent = response.content || {};
            showProductImage(productId, productAttributesData);
            updateProductAttributes($form, productAttributesData);
            updateView($form, productAttributesData, productAttributesContent);
            totalPrice();
        });
        return false;
    }
    
    function updateProductAttributes($scope, data) {
        const behavior = data.out_of_stock_behavior;
        const inStockIds = data.in_stock_attributes;
        const outOfStockMessage = ` (${data.out_of_stock_message})`;

        if (behavior !== 'hide_option' && behavior !== 'label_option') {
            return;
        }

        $('[data-product-attribute-value]', $scope).each((i, attribute) => {
            const $attribute = $(attribute);
            const attrId = parseInt($attribute.data('productAttributeValue'), 10);
            
            if (inStockIds.indexOf(attrId) !== -1) {
                enableAttribute($attribute, behavior, outOfStockMessage);
            } else {
                disableAttribute($attribute, behavior, outOfStockMessage);
            }
        });
    }

    function disableAttribute($attribute, behavior, outOfStockMessage) {
        if (getAttributeType($attribute) === 'set-select') {
            return disableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.hide();
        } else {
            $attribute.addClass('unavailable');
        }
    }

    function disableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        const $select = $attribute.parent();

        if (behavior === 'hide_option') {
            $attribute.toggleOption(false);
            // If the attribute is the selected option in a select dropdown, select the first option (MERC-639)
            if ($select.val() === $attribute.attr('value')) {
                $select[0].selectedIndex = 0;
            }
        } else {
            $attribute.attr('disabled', 'disabled');
            $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
        }
    }

    function enableAttribute($attribute, behavior, outOfStockMessage) {
        if (getAttributeType($attribute) === 'set-select') {
            return enableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.show();
        } else {
            $attribute.removeClass('unavailable');
        }
    }

    function enableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        if (behavior === 'hide_option') {
            $attribute.toggleOption(true);
        } else {
            $attribute.prop('disabled', false);
            $attribute.html($attribute.html().replace(outOfStockMessage, ''));
        }
    }

    function getAttributeType($attribute) {
        const $parent = $attribute.closest('[data-product-attribute]');

        return $parent ? $parent.data('productAttribute') : null;
    }

    function showProductImage(productId, data) {
        if (_.isPlainObject(data.image)) {

            const mainImageUrl = utils.tools.image.getSrc(
                data.image.data,
                context.themeSettings.product_size,
            );

            $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').find('img').attr({
                'src': mainImageUrl,
                'data-src': $(this).attr('src'),
            });

        } else {
            const mainImageUrl = $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').find('img').attr('data-src');
            $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').find('img').attr({
                'src': mainImageUrl,
                'data-src': $(this).attr('src'),
            });
        }
    }

    function updateView($scope, data, content = null) {
        const viewModel = getViewModel($scope);

        if (_.isObject(data.price)) {
            updatePriceView(viewModel, data.price);
        }
        var productId = $('[name="product_id"]', $scope).val();

        if (!data.purchasable || !data.instock) {
            $('#fbt_product' + productId).prop('checked', false).prop('disabled', true);
            $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').removeClass('hasOptions--selected');
            $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').addClass('out-stock');
        } else {
            $('#fbt_product' + productId).prop('checked', false).prop('disabled', false);
            $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').removeClass('out-stock');
            if ($scope.find('[data-fbt-option-change]').length) {
                var check = checkBeforeAdd($scope);
                if (check == true) {
                    $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').addClass('hasOptions--selected');
                    //$('[data-fbt-option-change]', $scope).slideUp();
                }
            }
        }
    }

    function updateDefaultAttributesForOOS($scope, data) {
        var productId = $('[name="product_id"]', $scope).val();

        if (!data.purchasable || !data.instock) {
            $('#fbt_product' + productId).prop('checked', false).prop('disabled', true);
            $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').removeClass('hasOptions--selected');
            $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').addClass('out-stock');
        } else {
            $('#fbt_product' + productId).prop('checked', true).prop('disabled', false);
            $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').removeClass('out-stock');
            if ($scope.find('[data-fbt-option-change]').length) {
                var check = checkBeforeAdd($scope);
                if (check == true) {
                    $('.themvale-fbt-product-item[data-product-id="' + productId + '"]').addClass('hasOptions--selected');
                    //$('[data-fbt-option-change]', $scope).slideUp();
                }
            }
        }
    }

    function getViewModel($scope) {
        return {
            $priceWithTax: $('[data-product-price-with-tax]', $scope),
            $priceWithoutTax: $('[data-product-price-without-tax]', $scope),
            rrpWithTax: {
                $div: $('.rrp-price--withTax', $scope),
                $span: $('[data-product-rrp-with-tax]', $scope),
            },
            rrpWithoutTax: {
                $div: $('.rrp-price--withoutTax', $scope),
                $span: $('[data-product-rrp-price-without-tax]', $scope),
            },
            nonSaleWithTax: {
                $div: $('.non-sale-price--withTax', $scope),
                $span: $('[data-product-non-sale-price-with-tax]', $scope),
            },
            nonSaleWithoutTax: {
                $div: $('.non-sale-price--withoutTax', $scope),
                $span: $('[data-product-non-sale-price-without-tax]', $scope),
            },
            priceSaved: {
                $div: $('.price-section--saving', $scope),
                $span: $('[data-product-price-saved]', $scope),
            },
            priceNowLabel: {
                $span: $('.price-now-label', $scope),
            },
            priceLabel: {
                $span: $('.price-label', $scope),
            },
            $weight: $('.productView-info [data-product-weight]', $scope),
            $increments: $('.form-field--increments :input', $scope),
            $addToCart: $('#form-action-addToCart', $scope),
            $wishlistVariation: $('[data-wishlist-add] [name="variation_id"]', $scope),
            stock: {
                $container: $('.form-field--stock', $scope),
                $input: $('[data-product-stock]', $scope),
            },
            $sku: $('[data-product-sku]'),
            $upc: $('[data-product-upc]'),
            quantity: {
                $text: $('.incrementTotal', $scope),
                $input: $('[name=qty\\[\\]]', $scope),
            },
            $bulkPricing: $('.productView-info-bulkPricing', $scope),
        };
    }

    function clearPricingNotFound(viewModel) {
        viewModel.rrpWithTax.$div.hide();
        viewModel.rrpWithoutTax.$div.hide();
        viewModel.nonSaleWithTax.$div.hide();
        viewModel.nonSaleWithoutTax.$div.hide();
        viewModel.priceSaved.$div.hide();
        viewModel.priceNowLabel.$span.hide();
        viewModel.priceLabel.$span.hide();
    }
    /**
     * Update the view of price, messages, SKU and stock options when a product option changes
     * @param  {Object} data Product attribute data
     */
    function updatePriceView(viewModel, price) {
        clearPricingNotFound(viewModel);

        if (price.with_tax) {
            viewModel.priceLabel.$span.show();
            viewModel.$priceWithTax.html(price.with_tax.formatted);
        }

        if (price.without_tax) {
            viewModel.priceLabel.$span.show();
            viewModel.$priceWithoutTax.html(price.without_tax.formatted);
        }

        if (price.rrp_with_tax) {
            viewModel.rrpWithTax.$div.show();
            viewModel.rrpWithTax.$span.html(price.rrp_with_tax.formatted);
        }

        if (price.rrp_without_tax) {
            viewModel.rrpWithoutTax.$div.show();
            viewModel.rrpWithoutTax.$span.html(price.rrp_without_tax.formatted);
        }

        if (price.saved) {
            viewModel.priceSaved.$div.show();
            viewModel.priceSaved.$span.html(price.saved.formatted);
        }

        if (price.non_sale_price_with_tax) {
            viewModel.priceLabel.$span.hide();
            viewModel.nonSaleWithTax.$div.show();
            viewModel.priceNowLabel.$span.show();
            viewModel.nonSaleWithTax.$span.html(price.non_sale_price_with_tax.formatted);
        }

        if (price.non_sale_price_without_tax) {
            viewModel.priceLabel.$span.hide();
            viewModel.nonSaleWithoutTax.$div.show();
            viewModel.priceNowLabel.$span.show();
            viewModel.nonSaleWithoutTax.$span.html(price.non_sale_price_without_tax.formatted);
        }
    }

    /**
     * https://stackoverflow.com/questions/49672992/ajax-request-fails-when-sending-formdata-including-empty-file-input-in-safari
     * Safari browser with jquery 3.3.1 has an issue uploading empty file parameters. This function removes any empty files from the form params
     * @param formData: FormData object
     * @returns FormData object
     */
    function filterEmptyFilesFromForm(formData) {
        try {
            for (const [key, val] of formData) {
                if (val instanceof File && !val.name && !val.size) {
                    formData.delete(key);
                }
            }
        } catch (e) {
            console.error(e); // eslint-disable-line no-console
        }
        return formData;
    }

}
