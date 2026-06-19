import ProductDetailsBase from '../../../theme/common/product-details-base';

describe('ProductDetailsBase.updateAddToCartForQty()', () => {
    let $scope;
    let instance;

    const buildScope = () => $(`
        <div>
            <div id="add-to-cart-wrapper">
                <div class="alertBox alertBox--error productAttributes-message" style="display:none;">
                    <p class="alertBox-message"></p>
                </div>
            </div>
            <input class="form-input--incrementTotal" />
            <button id="form-action-addToCart"></button>
        </div>
    `).appendTo(document.body);

    // Bypass the constructor (Wishlist.load, tab/radio wiring) and test the method directly.
    const makeInstance = (context, picklistViolation) => {
        const obj = Object.create(ProductDetailsBase.prototype);
        obj.$scope = $scope;
        obj.context = context;
        obj.picklistBackorder = { getSellLimitViolation: () => picklistViolation };
        return obj;
    };

    const viewModel = () => ({
        $addToCart: $('#form-action-addToCart', $scope),
        $increments: $('.form-input--incrementTotal', $scope),
    });

    afterEach(() => {
        if ($scope) {
            $scope.remove();
            $scope = null;
        }
    });

    it('re-enables Add to Cart when a picklist limit clears even though the main ATS is unknown', () => {
        $scope = buildScope();
        let violation = { name: 'Bundle 1', availableToSell: 3 };
        // Main product ATS unknown (0); only the picklist imposes a limit.
        instance = makeInstance({ availableToSell: 0 }, violation);
        const vm = viewModel();

        // Qty above the picklist limit → blocked with the picklist message.
        instance.updateAddToCartForQty(5, vm);
        expect(vm.$addToCart.prop('disabled')).toBe(true);
        expect($('.productAttributes-message', $scope).attr('data-qty-limit')).toBe('true');
        expect($('.alertBox-message', $scope).text()).toContain('Bundle 1');

        // Drop qty back into range → picklist limit no longer applies.
        violation = null;
        instance = makeInstance({ availableToSell: 0 }, violation);
        instance.updateAddToCartForQty(2, vm);

        expect(vm.$addToCart.prop('disabled')).toBe(false);
        expect($('.productAttributes-message', $scope).attr('data-qty-limit')).toBeUndefined();
        expect($('.productAttributes-message', $scope).css('display')).toBe('none');
    });

    it('keeps Add to Cart disabled when increments are disabled (out of stock)', () => {
        $scope = buildScope();
        $('.form-input--incrementTotal', $scope).prop('disabled', true);
        instance = makeInstance({ availableToSell: 0 }, { name: 'Bundle 1', availableToSell: 3 });
        const vm = viewModel();

        instance.updateAddToCartForQty(5, vm);
        instance.picklistBackorder.getSellLimitViolation = () => null;
        instance.updateAddToCartForQty(2, vm);

        expect(vm.$addToCart.prop('disabled')).toBe(true);
    });

    it('shows the main-product limit message and ignores the picklist when the main ATS is exceeded', () => {
        $scope = buildScope();
        instance = makeInstance(
            { availableToSell: 4, quantityMaxMessage: 'The maximum purchasable quantity is __QTY__' },
            { name: 'Bundle 1', availableToSell: 3 },
        );
        const vm = viewModel();

        instance.updateAddToCartForQty(6, vm);

        expect(vm.$addToCart.prop('disabled')).toBe(true);
        expect($('.alertBox-message', $scope).text()).toBe('The maximum purchasable quantity is 4');
    });
});
