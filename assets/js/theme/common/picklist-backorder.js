export default class PicklistBackorder {
    constructor($scope, context) {
        this.$scope = $scope;
        this.context = context;
        this.$list = $('[data-picklist-backorder-list]', $scope);
        this.lastData = null;
        this.detailsByProductId = new Map();
    }

    render(data, mainQty) {
        if (!this.$list.length) return;
        this.lastData = data;

        const selections = Array.isArray(data && data.selected_picklist_options)
            ? data.selected_picklist_options
            : [];
        const details = Array.isArray(data && data.picklist_products_details)
            ? data.picklist_products_details
            : [];

        this.detailsByProductId = new Map(
            details
                .filter(d => d && typeof d.product_id === 'number')
                .map(d => [d.product_id, d]),
        );

        const lines = this.buildLines(selections, this.detailsByProductId, mainQty);
        this.paint(lines);
    }

    rerender(mainQty) {
        if (this.lastData) this.render(this.lastData, mainQty);
    }

    buildLines(selections, detailsByProductId, mainQty) {
        if (this.context.showQuantityOnBackorder === false) {
            return [];
        }

        const lines = [];
        const requestedQty = parseInt(mainQty, 10) || 0;

        selections.forEach(sel => {
            if (!sel || sel.auto_adjust_inventory_flag !== true) return;
            if (typeof sel.product_id !== 'number') return;

            const detail = detailsByProductId.get(sel.product_id);
            if (!detail) return;
            if (detail.is_stock_tracked === false) return;
            if (detail.purchasable === false) return;

            const unlimited = detail.unlimited_backorder === true;
            const onHand = parseInt(detail.available_on_hand, 10) || 0;
            const afb = unlimited
                ? Infinity
                : parseInt(detail.available_for_backorder, 10) || 0;
            const needsBackorder = requestedQty - Math.min(requestedQty, onHand);
            const backordered = Math.min(needsBackorder, afb);

            if (backordered <= 0) return;

            const name = this.findAttributeName(sel.attribute_value_id);
            if (!name) return;

            lines.push({ productId: sel.product_id, name, qty: backordered });
        });

        return lines;
    }

    findAttributeName(attributeValueId) {
        if (attributeValueId === undefined || attributeValueId === null) return '';
        const $optionLabel = $(`label[data-product-attribute-value="${attributeValueId}"]`, this.$scope);
        if (!$optionLabel.length) return '';
        const $field = $optionLabel.closest('[data-product-attribute="product-list"]');
        if (!$field.length) return '';
        const $attrLabel = $field.children('label').first();
        if (!$attrLabel.length) return '';
        const firstText = $attrLabel.contents()
            .filter((_, node) => node.nodeType === 3 && node.nodeValue.trim())
            .first();
        return firstText.length ? firstText.text().trim().replace(/:\s*$/, '') : '';
    }

    paint(lines) {
        this.$list.empty();

        if (!lines.length) {
            this.$list.hide();
            return;
        }

        const qtyTemplate = this.context.quantityBackorderedMessage
            || '__QTY__ will be backordered';

        lines.forEach(({ name, qty, productId }) => {
            const qtyMsg = qtyTemplate.replace('__QTY__', qty);
            const messageText = this.lookupBackorderMessage(productId);
            const suffix = messageText ? ` | ${messageText}` : '';
            const $li = $('<li>', {
                class: 'productView-picklist-backorder-item',
            });
            $('<span>', {
                class: 'productView-picklist-backorder-name',
            }).text(`${name}:`).appendTo($li);
            $li.append(document.createTextNode(` ${qtyMsg}${suffix}`));
            this.$list.append($li);
        });

        this.$list.show();
    }

    lookupBackorderMessage(productId) {
        const detail = this.detailsByProductId && this.detailsByProductId.get(productId);
        if (!detail) return '';

        const messageId = detail.backorder_message_id;
        if (messageId == null) return '';

        const { backorderMessages, showBackorderMessage } = this.context;
        if (!showBackorderMessage) return '';
        if (!Array.isArray(backorderMessages)) return '';

        const messageObj = backorderMessages.find(m => m.id === messageId);
        return messageObj && messageObj.message ? messageObj.message : '';
    }
}
