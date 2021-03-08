import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    onReady() {
        this.arrangeFocusOnSortBy();

        //determine wheter or not the 'Remove All Items' button should be visible
        this.showRemoveAllItems();

        $('[data-button-type="add-cart"]').on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        // functionality associated with the 'Add All to Cart' button
        this.addAllToCartHandler();

        // functionality associated with the 'Remove All Items' button
        this.removeItemsFromCartHandler();

        // functionality associated with hovering over a card-img-container
        this.cardImageHandler();

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));

        this.ariaNotifyNoProducts();
    }

    showRemoveAllItems(){
        fetch(`/api/storefront/carts`,{
            method: "GET",
            credentials: "same-origin"
        })
        .then(response => response.json())
        .then(carts => carts[0])
        .then(cart => {
            if (!cart){
                //cart is not defined
                $('#remove-all').hide()
            }
        })
    }

    addAllToCartHandler(){
        $('.category#add-all-from-category').on('click', (e) => {
            e.preventDefault()
            const products = this.context.categoryProducts;
            if (products.length > 0 ){
                fetch(`/api/storefront/carts`,{
                    method: "GET",
                    credentials: "same-origin"
                })
                .then(response => response.json())
                .then(carts => carts[0])
                .then(cart => {
                    if (cart && cart.id){
                        // 'existant cart'
                        fetch(`/api/storefront/carts/${cart.id}/items`,{
                            method: "POST",
                            credentials: "same-origin",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                lineItems: products.map(x => ({quantity:1, productId: x.id}))
                            })
                        })
                    } else {
                        // 'non-existant cart'
                        // for whatever reason, this does not work *sometimes* 
                        //(as in the POST request/response(returns a new cart) is succesful, the cart is not created server-side?)
                        fetch(`/api/storefront/carts`, {
                            method: "POST",
                            credentials: "same-origin",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                lineItems: products.map(x => ({quantity:1, productId: x.id}))
                            })
                        })
                        .then(response => response.json())
                        .then(response => console.log(response));
                    }
                })

                //  After mutating the state of the cart, reveal the 'Remove All Items' button
                $('#remove-all').show()
            }
        })
    }

    removeItemsFromCartHandler(){
        $('.category#remove-all').on('click', (e) => {
            e.preventDefault()
            fetch(`/api/storefront/carts`,{
                method: "GET",
                credentials: "same-origin"
            })
            .then(response => response.json())
            .then(carts => carts[0])
            .then(cart => {
                if (cart && cart.id){
                    //https://developer.bigcommerce.com/api-reference/storefront/carts/cart-items/deletecartlineitem
                    // 'Removing the last line_item in the Cart deletes the Cart.'
                    fetch(`/api/storefront/carts/${cart.id}`,{
                        method: "DELETE",
                        credentials: "same-origin"
                    })
                }
            })
        })
    }

    cardImageHandler(){
        let originalSrcSet;
        let originalSrc;
        $('.card-image').hover(
            //on hover
            (e) => {
                const currentTarget = $(e.currentTarget);
                if(currentTarget.data('hover-srcset')) {
                    originalSrcSet = currentTarget.data('srcset');
                    currentTarget.attr('data-srcset', currentTarget.data('hover-srcset'));
                    currentTarget.attr('srcset', currentTarget.data('hover-srcset'));
                    
                    originalSrc = currentTarget.attr('src');
                    currentTarget.attr('src', currentTarget.data('hover-src'));

                    console.log('on hover', currentTarget);
                }
            },
            //off hover
            (e) => {
                const currentTarget = $(e.currentTarget)
                if(currentTarget.data('hover-srcset')){
                    currentTarget.attr('data-srcset',originalSrcSet);
                    currentTarget.attr('srcset',originalSrcSet);
                    currentTarget.attr('src', originalSrc);
                    console.log('off hover', currentTarget);
                }
            }

        )
    };

    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }
}
