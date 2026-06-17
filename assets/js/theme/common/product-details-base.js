import Wishlist from '../wishlist';
import { initRadioOptions } from './aria';
import PicklistBackorder from './picklist-backorder';

const optionsTypesMap = {
    INPUT_FILE: 'input-file',
    INPUT_TEXT: 'input-text',
    INPUT_NUMBER: 'input-number',
    INPUT_CHECKBOX: 'input-checkbox',
    TEXTAREA: 'textarea',
    DATE: 'date',
    SET_SELECT: 'set-select',
    SET_RECTANGLE: 'set-rectangle',
    SET_RADIO: 'set-radio',
    SWATCH: 'swatch',
    PRODUCT_LIST: 'product-list',
};

export function optionChangeDecorator(areDefaultOptionsSet) {
    return (err, response) => {
        if (err) return;
        const attributesData = response.data || {};
        const attributesContent = response.content || {};

        this.updateProductAttributes(attributesData);
        this.updateDisabledOptionValues(attributesData);
        if (areDefaultOptionsSet) {
            this.updateView(attributesData, attributesContent);
        } else {
            this.updateDefaultAttributesForOOS(attributesData);
        }
    };
}

export default class ProductDetailsBase {
    constructor($scope, context) {
        this.$scope = $scope;
        this.context = context;
        this.picklistBackorder = new PicklistBackorder($scope, this.context);
        this.initRadioAttributes();
        Wishlist.load(this.context);
        this.getTabRequests();

        $('[data-product-attribute]').each((__, value) => {
            const type = value.getAttribute('data-product-attribute');

            this._makeProductVariantAccessible(value, type);
        });

        if ((parseInt(this.context.availableToSell, 10) || 0) > 0) {
            this.toggleSoldOutAlert(true);
        }
    }

    _makeProductVariantAccessible(variantDomNode, variantType) {
        switch (variantType) {
        case optionsTypesMap.SET_RADIO:
        case optionsTypesMap.SWATCH: {
            initRadioOptions($(variantDomNode), '[type=radio]');
            break;
        }

        default: break;
        }
    }

    /**
     * Allow radio buttons to get deselected
     */
    initRadioAttributes() {
        $('[data-product-attribute] input[type="radio"]', this.$scope).each((i, radio) => {
            const $radio = $(radio);

            // Only bind to click once
            if ($radio.attr('data-state') !== undefined) {
                $radio.on('click', () => {
                    if ($radio.data('state') === true) {
                        $radio.prop('checked', false);
                        $radio.data('state', false);

                        $radio.trigger('change');
                    } else {
                        $radio.data('state', true);
                    }

                    this.initRadioAttributes();
                });
            }

            $radio.attr('data-state', $radio.prop('checked'));
        });
    }

    /**
     * Hide or mark as unavailable out of stock attributes if enabled
     * @param  {Object} data Product attribute data
     */
    updateProductAttributes(data) {
        const behavior = data.out_of_stock_behavior;
        const inStockIds = data.in_stock_attributes;
        const outOfStockDefaultMessage = this.context.outOfStockDefaultMessage;
        let outOfStockMessage = data.out_of_stock_message;

        if (behavior !== 'hide_option' && behavior !== 'label_option') {
            return;
        }

        if (outOfStockMessage) {
            outOfStockMessage = ` (${outOfStockMessage})`;
        } else {
            outOfStockMessage = ` (${outOfStockDefaultMessage})`;
        }

        $('[data-product-attribute-value]', this.$scope).each((i, attribute) => {
            const $attribute = $(attribute);
            const attrId = parseInt($attribute.data('productAttributeValue'), 10);

            if (inStockIds.indexOf(attrId) !== -1) {
                this.enableAttribute($attribute, behavior, outOfStockMessage);
            } else {
                this.disableAttribute($attribute, behavior, outOfStockMessage);
            }
        });
    }

    /**
     * Hide option values that would complete a "disable and hide" rule for the current selection
     * (CATALOG-12399). The server recomputes `disabled_option_values` on every option change, so a
     * value belonging to a multi-attribute rule only appears once the rule's other attributes are
     * selected ("show, then hide on selection"). The list is selection-relative, so values hidden
     * on a previous change are re-shown when they drop out of it.
     * @param  {Object} data Product attribute data
     */
    updateDisabledOptionValues(data) {
        const disabledOptionValues = data.disabled_option_values;

        if (!Array.isArray(disabledOptionValues)) {
            return;
        }

        const disabledValueIds = new Set(
            disabledOptionValues.map(({ value_id: valueId }) => parseInt(valueId, 10)),
        );

        const hiddenSelectedAttributes = [];

        $('[data-product-attribute-value]', this.$scope).each((i, attribute) => {
            const $attribute = $(attribute);
            const valueId = parseInt($attribute.data('productAttributeValue'), 10);

            if (disabledValueIds.has(valueId)) {
                // Remember a hidden value that is the current selection so we can move the option
                // to a valid value afterwards (e.g. the product's default values are the forbidden
                // combination, so the rule's last value must be hidden even though it is selected).
                if (this.getAttributeValueInput($attribute).prop('checked')) {
                    hiddenSelectedAttributes.push($attribute);
                }
                this.disableAttribute($attribute, 'hide_option', '');
                $attribute.data('ruleHidden', true);
            } else if ($attribute.data('ruleHidden') === true) {
                // This value was hidden by the rule and no longer is. Re-show it only if
                // out-of-stock handling is not also hiding it, so we don't reveal a value the
                // stock logic in updateProductAttributes() kept hidden.
                $attribute.data('ruleHidden', false);
                if (!this.isHiddenByStock(data, valueId)) {
                    this.enableAttribute($attribute, 'hide_option', '');
                }
            }
        });

        this.reselectHiddenSelectedValues(hiddenSelectedAttributes, disabledValueIds, data);
    }

    /**
     * Whether out-of-stock handling hides the given value. Only the `hide_option` behavior hides
     * values; a value is hidden when it is absent from `in_stock_attributes`.
     * @param  {Object} data Product attribute data
     * @param  {number} valueId attribute value id
     * @return {boolean}
     */
    isHiddenByStock(data, valueId) {
        if (data.out_of_stock_behavior !== 'hide_option') {
            return false;
        }

        const inStockIds = Array.isArray(data.in_stock_attributes) ? data.in_stock_attributes : [];

        return !inStockIds.includes(valueId);
    }

    /**
     * Resolve the radio input associated with a [data-product-attribute-value] label. Radio,
     * rectangle and swatch options render the value as a <label for="..."> whose input is a
     * sibling, so the input is looked up by the label's `for` attribute. Returns an empty set for
     * options without a linked input (e.g. select <option>s, which handle reselection themselves).
     * @param  {Object} $attribute jQuery wrapped [data-product-attribute-value] element
     * @return {Object} jQuery wrapped input, empty when there is no linked input
     */
    getAttributeValueInput($attribute) {
        const inputId = $attribute.attr('for');

        return inputId ? $(`#${inputId}`, this.$scope) : $();
    }

    /**
     * When a "disable and hide" rule hides the currently selected value of an option (typically
     * because the product's default option values are themselves the forbidden combination), move
     * that option to its next available value and fire a single change so the server recomputes the
     * disabled values for the corrected, valid selection. Options with no remaining available value
     * are left untouched so the invalid combination keeps the product unpurchasable.
     * @param {Object[]} hiddenSelectedAttributes selected value labels that were just hidden
     * @param {Set} disabledValueIds value ids hidden for the current selection
     * @param {Object} data Product attribute data
     */
    reselectHiddenSelectedValues(hiddenSelectedAttributes, disabledValueIds, data) {
        let $changeTrigger = null;

        hiddenSelectedAttributes.forEach($hiddenAttribute => {
            const $option = $hiddenAttribute.closest('[data-product-attribute]');
            let $target = null;

            $('[data-product-attribute-value]', $option).each((i, attribute) => {
                const $attribute = $(attribute);
                const valueId = parseInt($attribute.data('productAttributeValue'), 10);

                // Skip values the rule hides or that are out of stock, so we never move the
                // selection onto a value that should not be selectable.
                if (disabledValueIds.has(valueId) || this.isHiddenByStock(data, valueId)) {
                    return true;
                }

                const $input = this.getAttributeValueInput($attribute);
                if ($input.length && !$input.prop('disabled')) {
                    $target = $input;
                    return false;
                }

                return true;
            });

            if (!$target) {
                return;
            }

            this.getAttributeValueInput($hiddenAttribute)
                .prop('checked', false)
                .data('state', false);
            $target.prop('checked', true).data('state', true);
            $changeTrigger = $target;
        });

        if ($changeTrigger) {
            $changeTrigger.trigger('change');
        }
    }

    /**
     * Check for fragment identifier in URL requesting a specific tab
     */
    getTabRequests() {
        if (window.location.hash && window.location.hash.indexOf('#tab-') === 0) {
            const $activeTab = $('.tabs').has(`[href='${window.location.hash}']`);
            const $tabContent = $(`${window.location.hash}`);

            if ($activeTab.length > 0) {
                $activeTab.find('.tab')
                    .removeClass('is-active')
                    .has(`[href='${window.location.hash}']`)
                    .addClass('is-active');

                $tabContent.addClass('is-active')
                    .siblings()
                    .removeClass('is-active');
            }
        }
    }

    /**
     * Since $productView can be dynamically inserted using render_with,
     * We have to retrieve the respective elements
     *
     * @param $scope
     */
    getViewModel($scope) {
        return {
            priceWithTax: {
                $div: $('.price--withTax', $scope),
                $span: $('[data-product-price-with-tax]', $scope),
            },
            priceWithoutTax: {
                $div: $('.price--withoutTax', $scope),
                $span: $('[data-product-price-without-tax]', $scope),
            },
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
            $addToCartForm: $('form[data-cart-item-add]', $scope),
            $wishlistVariation: $('[data-wishlist-add] [name="variation_id"]', $scope),
            stock: {
                $container: $('.form-field--stock', $scope),
                $input: $('[data-product-stock]', $scope),
            },
            $backordered: $('[data-product-backordered]', $scope),
            $backorderedQtyMessage: $('[data-qty-backordered-message]', $scope),
            $backorderMessage: $('[data-backorder-message]', $scope),
            $backorderPrompt: $('[data-backorder-prompt]', $scope),
            sku: {
                $label: $('dt.sku-label', $scope),
                $value: $('[data-product-sku]', $scope),
            },
            upc: {
                $label: $('dt.upc-label', $scope),
                $value: $('[data-product-upc]', $scope),
            },
            quantity: {
                $text: $('.incrementTotal', $scope),
                $input: $('[name=qty\\[\\]]', $scope),
            },
            $bulkPricing: $('.productView-info-bulkPricing', $scope),
            $walletButtons: $('[data-add-to-cart-wallet-buttons]', $scope),
        };
    }

    /**
     * Hide the pricing elements that will show up only when the price exists in API
     * @param viewModel
     */
    clearPricingNotFound(viewModel) {
        viewModel.rrpWithTax.$div.hide();
        viewModel.rrpWithoutTax.$div.hide();
        viewModel.nonSaleWithTax.$div.hide();
        viewModel.nonSaleWithoutTax.$div.hide();
        viewModel.priceSaved.$div.hide();
        viewModel.priceNowLabel.$span.hide();
        viewModel.priceLabel.$span.hide();
        viewModel.priceWithTax.$div.hide();
        viewModel.priceWithoutTax.$div.hide();
    }

    updateQtyBackorderedMessage(qty, passedViewModel) {
        const viewModel = passedViewModel || this.getViewModel(this.$scope);

        if (!viewModel.$backordered.length) return;

        if (this.context.showQuantityOnBackorder === false) {
            viewModel.$backorderedQtyMessage.text('');
            this.toggleBackorderedContainer(viewModel);
            return;
        }

        const contextOnHand = parseInt(this.context.availableOnHand, 10);
        const stockFromDom = parseInt(viewModel.stock.$input.text(), 10);
        let onHand = 0;

        if (!Number.isNaN(contextOnHand) && contextOnHand > 0) {
            onHand = contextOnHand;
        } else if (!Number.isNaN(stockFromDom)) {
            onHand = stockFromDom;
        }

        const unlimited = this.context.unlimitedBackorder === true;
        const availableForBackorder = unlimited
            ? Infinity
            : parseInt(this.context.availableForBackorder, 10) || 0;
        const backordered = Math.max(0, Math.min(qty - onHand, availableForBackorder));

        if (backordered > 0) {
            const message = this.context.quantityBackorderedMessage
                ? this.context.quantityBackorderedMessage.replace('__QTY__', backordered)
                : `${backordered} will be backordered`;
            viewModel.$backorderedQtyMessage.text(message);
        } else {
            viewModel.$backorderedQtyMessage.text('');
        }

        this.toggleBackorderedContainer(viewModel);
    }

    updateBackorderMessage(passedViewModel) {
        const viewModel = passedViewModel || this.getViewModel(this.$scope);

        if (!viewModel.$backordered.length) return;

        const hasQtyMessage = viewModel.$backorderedQtyMessage.text().trim() !== '';

        if (!hasQtyMessage) {
            viewModel.$backorderMessage.text('');
            return;
        }

        const { showBackorderMessage, backorderMessages, backorderMessageId } = this.context;

        if (showBackorderMessage && backorderMessageId != null && Array.isArray(backorderMessages)) {
            const messageObj = backorderMessages.find(m => m.id === backorderMessageId);
            if (messageObj) {
                viewModel.$backorderMessage.text(messageObj.message);
                return;
            }
        }

        viewModel.$backorderMessage.text('');
    }

    toggleBackorderedContainer(viewModel) {
        const hasQtyMessage = viewModel.$backorderedQtyMessage.text().trim() !== '';

        if (hasQtyMessage) {
            viewModel.$backordered.show();
        } else {
            viewModel.$backordered.hide();
        }
    }

    updateAddToCartForQty(qty, passedViewModel) {
        const viewModel = passedViewModel || this.getViewModel(this.$scope);
        const unlimited = this.context.unlimitedBackorder === true;
        const availableToSell = unlimited
            ? Infinity
            : parseInt(this.context.availableToSell, 10) || 0;

        if (availableToSell <= 0) return;

        const $variantMessage = $('#add-to-cart-wrapper .productAttributes-message', this.$scope);

        if (qty > availableToSell) {
            viewModel.$addToCart.prop('disabled', true);

            const template = this.context.quantityMaxMessage || 'The maximum purchasable quantity is __QTY__';
            const message = template.replace('__QTY__', availableToSell);
            $('.alertBox-message', $variantMessage).text(message);
            $variantMessage.attr('data-qty-limit', 'true').show();
        } else if (!viewModel.$increments.prop('disabled')) {
            viewModel.$addToCart.prop('disabled', false);

            if ($variantMessage.attr('data-qty-limit') === 'true') {
                $variantMessage.removeAttr('data-qty-limit').hide();
                $('.alertBox-message', $variantMessage).text('');
            }
        }
    }

    updateBackorderContext(data) {
        if (typeof data.available_on_hand === 'number') {
            this.context.availableOnHand = data.available_on_hand;
        } else if (typeof data.stock === 'number') {
            this.context.availableOnHand = data.stock;
        }
        if (typeof data.available_for_backorder === 'number') {
            this.context.availableForBackorder = data.available_for_backorder;
        }
        if (typeof data.available_to_sell === 'number') {
            this.context.availableToSell = data.available_to_sell;
        }
        if (typeof data.show_backorder_availability_prompt === 'boolean') {
            this.context.showBackorderAvailabilityPrompt = data.show_backorder_availability_prompt;
        }
        if (typeof data.backorder_availability_prompt === 'string') {
            this.context.backorderAvailabilityPrompt = data.backorder_availability_prompt;
        }
        if (typeof data.unlimited_backorder === 'boolean') {
            this.context.unlimitedBackorder = data.unlimited_backorder;
        }
        this.context.backorderMessageId = data.backorder_message_id ?? null;
    }

    updateBackorderPrompt(passedViewModel) {
        const viewModel = passedViewModel || this.getViewModel(this.$scope);

        if (!viewModel.$backorderPrompt.length) return;

        const showPrompt = this.context.showBackorderAvailabilityPrompt;
        const unlimited = this.context.unlimitedBackorder === true;
        const availableForBackorder = unlimited
            ? Infinity
            : parseInt(this.context.availableForBackorder, 10) || 0;
        const availableToSell = unlimited
            ? Infinity
            : parseInt(this.context.availableToSell, 10) || 0;
        const promptText = this.context.backorderAvailabilityPrompt;

        if (showPrompt && availableToSell > 0 && availableForBackorder > 0 && promptText) {
            viewModel.$backorderPrompt.text(promptText).show();
        } else {
            viewModel.$backorderPrompt.hide();
        }
    }

    /**
     * Update the view of price, messages, SKU and stock options when a product option changes
     * @param  {Object} data Product attribute data
     */
    updateView(data, content = null) {
        const viewModel = this.getViewModel(this.$scope);

        this.showMessageBox(data.stock_message || data.purchasing_message);

        if (data.price instanceof Object) {
            this.updatePriceView(viewModel, data.price);
        } else {
            this.clearPricingNotFound(viewModel);
        }

        if (data.weight instanceof Object) {
            viewModel.$weight.html(data.weight.formatted);
        }

        // Set variation_id if it exists for adding to wishlist
        if (data.variantId) {
            viewModel.$wishlistVariation.val(data.variantId);
        }

        // If SKU is available
        if (data.sku) {
            viewModel.sku.$value.text(data.sku);
            viewModel.sku.$label.show();
        } else {
            viewModel.sku.$label.hide();
            viewModel.sku.$value.text('');
        }

        // If UPC is available
        if (data.upc) {
            viewModel.upc.$value.text(data.upc);
            viewModel.upc.$label.show();
        } else {
            viewModel.upc.$label.hide();
            viewModel.upc.$value.text('');
        }

        // if stock view is on (CP settings)
        if (viewModel.stock.$container.length && typeof data.stock === 'number') {
            // if the stock container is hidden, show
            viewModel.stock.$container.removeClass('u-hiddenVisually');

            viewModel.stock.$input.text(data.stock);
        } else {
            viewModel.stock.$container.addClass('u-hiddenVisually');
            viewModel.stock.$input.text(data.stock);
        }

        this.updateBackorderContext(data);
        this.updateBackorderPrompt(viewModel);

        const currentQty = parseInt(viewModel.quantity.$input.val(), 10) || 0;
        this.updateQtyBackorderedMessage(currentQty, viewModel);
        this.updateBackorderMessage(viewModel);
        this.picklistBackorder.render(data, currentQty);

        this.updateDefaultAttributesForOOS(data);
        this.updateAddToCartForQty(currentQty, viewModel);
        this.updateWalletButtonsView(data);

        // If Bulk Pricing rendered HTML is available
        if (data.bulk_discount_rates && content) {
            viewModel.$bulkPricing.html(content);
        } else if (typeof (data.bulk_discount_rates) !== 'undefined') {
            viewModel.$bulkPricing.html('');
        }

        const addToCartWrapper = $('#add-to-cart-wrapper');

        if (addToCartWrapper.is(':hidden') && data.purchasable) {
            addToCartWrapper.show();
        }
    }

    /**
     * Update the view of price, messages, SKU and stock options when a product option changes
     * @param  {Object} data Product attribute data
     */
    updatePriceView(viewModel, price) {
        this.clearPricingNotFound(viewModel);

        if (price.with_tax) {
            const updatedPrice = price.price_range
                ? `${price.price_range.min.with_tax.formatted} - ${price.price_range.max.with_tax.formatted}`
                : price.with_tax.formatted;
            viewModel.priceLabel.$span.show();
            viewModel.priceWithTax.$div.show();
            viewModel.priceWithTax.$span.html(updatedPrice);
        }

        if (price.without_tax) {
            const updatedPrice = price.price_range
                ? `${price.price_range.min.without_tax.formatted} - ${price.price_range.max.without_tax.formatted}`
                : price.without_tax.formatted;
            viewModel.priceLabel.$span.show();
            viewModel.priceWithoutTax.$div.show();
            viewModel.priceWithoutTax.$span.html(updatedPrice);
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
     * Show variant-level error message box if a message is passed
     * Hide the box if the message is empty or if product-level error message box is already present
     * @param  {String} message
     */
    showMessageBox(message) {
        const $variantErrorBox = $('.productAttributes-message', this.$scope);
        const $productErrorBox = $('.alertBox--error', this.$scope).not('.productAttributes-message');

        if (!message || $productErrorBox.length) {
            $variantErrorBox.hide();
            return;
        }

        $('.alertBox-message', $variantErrorBox).text(message);
        $variantErrorBox.show();
    }

    updateDefaultAttributesForOOS(data) {
        const viewModel = this.getViewModel(this.$scope);
        const dataAvailableToSell = typeof data.available_to_sell === 'number'
            ? data.available_to_sell
            : parseInt(this.context.availableToSell, 10) || 0;
        const canSell = data.instock || dataAvailableToSell > 0;
        if (!data.purchasable || !canSell) {
            viewModel.$addToCart.prop('disabled', true);
            viewModel.$increments.prop('disabled', true);
        } else {
            viewModel.$addToCart.prop('disabled', false);
            viewModel.$increments.prop('disabled', false);
        }

        this.toggleSoldOutAlert(canSell);
    }

    toggleSoldOutAlert(canSell) {
        const $soldOut = $('#add-to-cart-wrapper .alertBox--error', this.$scope).not('.productAttributes-message');
        const $variantMessage = $('#add-to-cart-wrapper .productAttributes-message', this.$scope);

        if (canSell) {
            $soldOut.hide();
            $variantMessage.hide();
        } else if ($soldOut.length) {
            $soldOut.show();
        }
    }

    updateWalletButtonsView(data) {
        const viewModel = this.getViewModel(this.$scope);
        const isValidForm = viewModel.$addToCartForm?.[0]?.checkValidity() ?? true;
        const dataAvailableToSell = typeof data.available_to_sell === 'number'
            ? data.available_to_sell
            : parseInt(this.context.availableToSell, 10) || 0;
        const canSell = data.instock || dataAvailableToSell > 0;

        this.toggleWalletButtonsVisibility(isValidForm && data.purchasable && canSell);
    }

    toggleWalletButtonsVisibility(shouldShow) {
        const viewModel = this.getViewModel(this.$scope);

        if (shouldShow) {
            viewModel.$walletButtons.show();
        } else {
            viewModel.$walletButtons.hide();
        }
    }

    enableAttribute($attribute, behavior, outOfStockMessage) {
        if (this.getAttributeType($attribute) === 'set-select') {
            return this.enableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.show();
        } else {
            $attribute.removeClass('unavailable');
        }
    }

    disableAttribute($attribute, behavior, outOfStockMessage) {
        if (this.getAttributeType($attribute) === 'set-select') {
            return this.disableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.hide(0);
        } else {
            $attribute.addClass('unavailable');
        }
    }

    getAttributeType($attribute) {
        const $parent = $attribute.closest('[data-product-attribute]');

        return $parent ? $parent.data('productAttribute') : null;
    }

    disableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        const $select = $attribute.parent();

        if (behavior === 'hide_option') {
            $attribute.toggleOption(false);
            // If the attribute is the selected option in a select dropdown, select the first option (MERC-639)
            if ($select.val() === $attribute.attr('value')) {
                $select[0].selectedIndex = 0;
            }
        } else {
            $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
        }
    }

    enableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        if (behavior === 'hide_option') {
            $attribute.toggleOption(true);
        } else {
            $attribute.html($attribute.html().replace(outOfStockMessage, ''));
        }
    }
}
