import ProductDetailsBase from '../../../theme/common/product-details-base';

// Build an instance without running the (DOM/event-wiring) constructor; reselectHiddenSelectedValues
// only needs this.$scope plus the real getAttributeType/getAttributeValueInput/isHiddenByStock.
const makeInstance = $scope => {
    const instance = Object.create(ProductDetailsBase.prototype);
    instance.$scope = $scope;
    return instance;
};

// out_of_stock_behavior !== 'hide_option' → isHiddenByStock() is always false, isolating the rule path.
const data = { out_of_stock_behavior: 'do_nothing', in_stock_attributes: [] };

const radioInput = (optionId, v) => `<input class="form-radio" type="radio" id="attribute_radio_${optionId}_${v.id}"
        name="attribute[${optionId}]" value="${v.id}"
        ${v.default ? 'data-default' : ''} ${v.selected ? 'checked' : ''}>
     <label data-product-attribute-value="${v.id}" class="form-label"
        for="attribute_radio_${optionId}_${v.id}">${v.label}</label>`;

const radioOption = (optionId, values) => {
    const $scope = $(
        `<div><div class="form-field" data-product-attribute="set-radio">
            ${values.map(v => radioInput(optionId, v)).join('')}
        </div></div>`,
    );
    $scope.appendTo(document.body);
    return $scope;
};

const selectOption = (values) => {
    const opts = values
        .map(v => `<option data-product-attribute-value="${v.id}" value="${v.id}"
            ${v.default ? 'data-default' : ''} ${v.selected ? 'selected' : ''}>${v.label}</option>`)
        .join('');
    const $scope = $(
        `<div><div class="form-field" data-product-attribute="set-select">
            <select>
                <option data-product-attribute-value="" value="">choose</option>
                ${opts}
            </select>
        </div></div>`,
    );
    $scope.appendTo(document.body);
    return $scope;
};

const labelFor = ($scope, valueId) => $scope.find(`[data-product-attribute-value="${valueId}"]`);

describe('ProductDetailsBase.reselectHiddenSelectedValues', () => {
    let $scope;

    afterEach(() => {
        if ($scope) {
            $scope.remove();
            $scope = null;
        }
        $(document.body).empty();
    });

    it('does NOT auto-select the next value when the hidden default has no available default to fall back to', () => {
        // Option B: b1 is the default and is selected; the rule hides b1 (default-into-conflict).
        $scope = radioOption(5, [
            {
                id: 11, label: 'b1', default: true, selected: true,
            },
            { id: 12, label: 'b2' },
        ]);
        const instance = makeInstance($scope);
        const $hidden = labelFor($scope, 11);

        instance.reselectHiddenSelectedValues([$hidden], new Set([11]), data);

        // b2 is not a default, so it must not be auto-selected.
        expect($scope.find('input[value="12"]').prop('checked')).toBe(false);
        // The hidden value must be deselected so the forbidden value can't be submitted.
        expect($scope.find('input[value="11"]').prop('checked')).toBe(false);
    });

    it('snaps back to the default value when a hidden non-default was selected and the default is available', () => {
        // Shopper selected b2 (non-default); the rule hides b2; default b1 is still available.
        $scope = radioOption(5, [
            { id: 11, label: 'b1', default: true },
            { id: 12, label: 'b2', selected: true },
        ]);
        const instance = makeInstance($scope);
        const $hidden = labelFor($scope, 12);

        instance.reselectHiddenSelectedValues([$hidden], new Set([12]), data);

        expect($scope.find('input[value="11"]').prop('checked')).toBe(true);
        expect($scope.find('input[value="12"]').prop('checked')).toBe(false);
    });

    it('does NOT move a select option onto a non-default value when the default is hidden', () => {
        $scope = selectOption([
            {
                id: 11, label: 'b1', default: true, selected: true,
            },
            { id: 12, label: 'b2' },
        ]);
        const instance = makeInstance($scope);
        const $hidden = $scope.find('option[value="11"]');

        instance.reselectHiddenSelectedValues([$hidden], new Set([11]), data);

        expect($scope.find('select').val()).not.toBe('12');
    });
});
