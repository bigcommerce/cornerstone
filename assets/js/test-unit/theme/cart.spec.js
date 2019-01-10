import $ from 'jquery'
import utils from '@bigcommerce/stencil-utils';
import Cart from '../../theme/cart.js';

var dataSpy;
var UpdateSpy;
var c = new Cart();
beforeEach(function() {
	UpdateSpy = spyOn(utils.api.cart, 'itemUpdate');

	dataSpy = function(requestedAction = null) {
		spyOn(jQuery.fn, 'data').and.callFake(function() {
		    var param = arguments[0];
		    switch (param) {
		    case 'action':
		    	return requestedAction;
		    case 'cartItemid':
		    	return '11111';
		    case 'quantityMax':
		    	return 5;
		    case 'quantityMin':
		    	return 1;
		    case 'quantityMinError':
		    	return 'min error';
		    case 'quantityMaxError':
		    	return ' max error';
		    default:
		    	return null;
		    }
		})
	};
});

var $dom = $('<table class="cart" data-cart-quantity="2">\
    <thead class="cart-header">\
        <tr>\
            <th class="cart-header-item" colspan="2">Item</th>\
            <th class="cart-header-item">Price</th>\
            <th class="cart-header-item cart-header-quantity">Quantity</th>\
            <th class="cart-header-item">Total</th>\
        </tr>\
    </thead>\
    <tbody class="cart-list">\
            <tr class="cart-item" data-item-row="">\
                <td class="cart-item-block cart-item-figure">\
                        <img class="cart-item-image lazyautosizes lazyloaded" data-sizes="auto" src="www.example.com" data-src="www.example.com" alt="[Sample] product" title="[Sample] product">\
                </td>\
                <td class="cart-item-block cart-item-title">\
                    <h4 class="cart-item-name"><a href="/fog-linen-chambray-towel-beige-stripe/">[Sample] Fog Linen Chambray Towel - Beige Stripe</a></h4>\
                        <dl class="definitionList">\
                                <dt class="definitionList-key">Size:</dt>\
                                <dd class="definitionList-value">\
                                        XS\
                                </dd>\
                                <dt class="definitionList-key">Color:</dt>\
                                <dd class="definitionList-value">\
                                        Silver\
                                </dd>\
                        </dl>\
                        <a href="#" data-item-edit="item-id">Change</a>\
                </td>\
                <td class="cart-item-block cart-item-info">\
                    <span class="cart-item-label">Price</span>\
                        <span class="cart-item-value ">$49.00</span>\
                </td>\
                <td class="cart-item-block cart-item-info cart-item-quantity">\
                    <label class="form-label cart-item-label" for="qty-item-id">Quantity:</label>\
                    <div class="form-increment">\
                        <button class="button button--icon" data-cart-update="" data-cart-itemid="item-id" data-action="dec">\
                            <span class="is-srOnly">Decrease Quantity:</span>\
                            <i class="icon" aria-hidden="true"><svg><use xmlns:xlink="www.ccc.com"></use></svg></i>\
                        </button>\
                        <input class="form-input form-input--incrementTotal cart-item-qty-input" id="item-id" name="qty-item-id" type="tel" value="2" data-quantity-min="0" data-quantity-max="" data-quantity-min-error="The minimum purchasable quantity is 0" data-quantity-max-error="The maximum purchasable quantity is null" min="1" pattern="[0-9]*" data-cart-itemid="item-id" data-action="manualQtyChange" aria-live="polite">\
                            <button class="button button--icon" data-cart-update="" data-cart-itemid="item-id" data-action="inc">\
                                <span class="is-srOnly">Increase Quantity:</span>\
                                <i class="icon" aria-hidden="true"><svg><use xmlns:xlink="www.ddd.com"></use></svg></i>\
                            </button>\
                    </div>\
                </td>\
                <td class="cart-item-block cart-item-info">\
                    <span class="cart-item-label">Total</span>\
                        <strong class="cart-item-value ">$98.00</strong>\
                        <a class="cart-remove icon" data-cart-itemid="item-id" href="#" data-confirm-delete="Are you sure you want to delete this item?">\
                            <svg><use xmlns:xlink="www.eee.com" xlink:href="#icon-close"></use></svg>\
                        </a>\
                </td>\
            </tr>\
    </tbody>\
</table>')

c.onReady();

describe('cartUpdate', () => {
    it('should INCRIMENT qty', () => {	
		dataSpy
		dataSpy('inc');
		spyOn(jQuery.fn, 'val').and.returnValue(2);
		c.cartUpdate($dom);
		
		expect(UpdateSpy).toHaveBeenCalledWith('11111', 3, jasmine.any(Function));  
	});

    it('should DECREMENT qty', () => {	
		dataSpy
		dataSpy('dec');
		spyOn(jQuery.fn, 'val').and.returnValue(2);
		c.cartUpdate($dom);
		
		expect(UpdateSpy).toHaveBeenCalledWith('11111', 1, jasmine.any(Function));  
	});
});

describe('cartUpdateQtyTextChange', () => {
    it('should CHANGE qty completly based on the cart-item-qty-input', () => {	
		dataSpy
		dataSpy('manualQtyChange');
		spyOn(jQuery.fn, 'attr').and.returnValue(5);
		spyOn(jQuery.fn, 'val').and.returnValue(2);
		c.cartUpdateQtyTextChange($dom);
		
		expect(UpdateSpy).toHaveBeenCalledWith('11111', 5, jasmine.any(Function));  
	});
});
