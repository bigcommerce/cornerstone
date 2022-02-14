import $ from 'jquery';
import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import { defaultModal } from '../global/modal';

// We want to ensure that the events are bound to a single instance of the product details component
let productSingleton = null;


export default function (context) {

    const modal = defaultModal();

    const $ajaxcart = $("a.themevale_btnATC");
    const $content = $('<div class="modal-body quickView"></div>');
    var j, count = 0, error = 0, qty = 0;
    var list_product = "";

    $(document).ready(function() {

        $('body').on('click', '.themevale_btnATC', (event) => {

            event.preventDefault();
            var pro;
            qty = 0;
            const productId = $(event.currentTarget).data('product-id');
            pro = { "action": "add", "fastcart": "1", "product_id": productId, "qty[]": "1" };
            qty += 1;

            //var check = checkBeforeAdd(pro);
            error = 0;
            addToCart(pro);
        });
        

        function checkBeforeAdd(data) {

            const product_id = data.product_id;
            const $el = $(`#data-product-qty-${product_id}`);
            const oldQty = parseInt($el.val(), 10);

            var product_name = $el.find("img").attr("alt");
            list_product += '<li class="previewCartItem"><div class="previewCartItem-image"><a href="' + $el.find("a").attr("href") + '">\
                <img src="' + $el.find("img").attr("src") + '" ></a></div>\
                <div class="previewCartItem-content"><h6 class="previewCartItem-name"><a href="' + $el.find("a").attr("href") + '">' + product_name + '</a></h6><dl class="definitionList">';
        }

        function addToCart(data) {
            const product_id = data.product_id;
            const $el = $(`#data-product-qty-${product_id}`);
            
            var form_data = new FormData();
            for (var key in data) {
                form_data.append(key, data[key]);
            }

            // Add item to cart
            utils.api.cart.itemAdd(form_data, (err, response) => {
                const errorMessage = err || response.data.error;

                // Guard statement
                if (errorMessage) {
                    // Strip the HTML from the error message
                    const tmp = document.createElement('DIV');
                    tmp.innerHTML = errorMessage;
                    $el.val(0);
                    return alert(tmp.textContent || tmp.innerText);
                }

                count++;
                $el.val(0);

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

                if ($(window).width() > 1024) {
                    $('body').addClass('themevale_open_cart');
                    $('.wrapper-top-cart .cart-icon').addClass('is-open');
                } else {
                    $('body').addClass('themevale_open-Cart');
                }
                
                getCart(qty, response.data.cart_item.hash);

            });
        }


        function getCart(qty, cartItemHash) {
            // modal.open();
            const options = {
                template: 'cart/preview',
                params: {
                    suggest: cartItemHash,
                },
            };

            utils.api.cart.getContent(options, (err, response) => {
                if (err) {
                    return;
                }

                modal.updateContent(response);

                // Update cart counter
                const $body = $('body');
                const $cartQuantity = $('[data-cart-quantity]', modal.$content);
                const $cartCounter = $('.navUser-action .cart-count');
                const quantity = $cartQuantity.data('cart-quantity') || 0;

                $cartCounter.addClass('cart-count--positive');
                $('body').trigger('cart-quantity-update', quantity);
            });
        }

    });

}
