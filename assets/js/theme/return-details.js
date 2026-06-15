import { escape } from 'lodash';
import PageManager from './page-manager';

const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default class ReturnDetails extends PageManager {
    onReady() {
        const root = document.querySelector('[data-return-details]');
        if (!root) return;

        this.root = root;

        const details = this.root.dataset.returnDetails ? JSON.parse(this.root.dataset.returnDetails) : null;

        this.pageData = {
            entityId: details.entityId,
            rma: details.rma,
            orderId: details.orderId,
            status: details.status,
            dateSubmitted: dateFmt.format(new Date(details.dateSubmitted)),
            lastUpdated: dateFmt.format(new Date(details.lastUpdated)),
            items: details.items.map(item => ({
                entityId: item.entityId,
                orderLineItemId: item.orderLineItemId,
                quantity: item.quantity,
                status: item.status,
                reasonId: item.reasonId,
                reasonSnapshot: item.reasonSnapshot,
                lineItemSnapshot: {
                    quantity: item.lineItemSnapshot.quantity,
                    productIdentifiers: item.lineItemSnapshot.productIdentifiers,
                    product: {
                        sku: item.lineItemSnapshot.product.sku,
                        displayName: item.lineItemSnapshot.product.displayName,
                    },
                },
                pricing: {
                    discountedPrice: item.pricing.discountedPrice,
                },
                resolution: {
                    displayName: item.resolution.displayName,
                    outcome: item.resolution.outcome,
                    requested: {
                        type: item.resolution.requested.type,
                        label: item.resolution.requested.label,
                    },
                },
                thumbnailUrl: item.thumbnailUrl,
                variant: item.variant,
            })),
        };


        this.renderHeader();
        this.renderShipping();
        this.renderItems();
        this.renderSummary();
    }

    renderHeader() {
        const { rma, status } = this.pageData;
        const titleEl = this.root.querySelector('[data-return-title]');
        const statusEl = this.root.querySelector('[data-return-status]');

        if (titleEl) titleEl.textContent = `Return #${rma}`;
        if (statusEl) {
            const statusLabels = {
                OPEN: this.context.returnStatusOpen,
                IN_PROGRESS: this.context.returnStatusInProgress,
                CLOSED: this.context.returnStatusClosed,
            };
            statusEl.textContent = statusLabels[status] || status;
            statusEl.classList.add(`returnDetails-statusBadge--${status.toLowerCase()}`);
        }
    }

    renderShipping() {
        const container = this.root.querySelector('[data-return-shipping]');
        if (!container) return;

        // the return data does not have shipping data yet
        if (!this.pageData.shipping) {
            container.innerHTML = '';
            return;
        }

        const {
            address, method, trackingNumber, dateShipped,
        } = this.pageData.shipping;
        const addressLine = [
            address.fullName,
            address.address1,
            `${address.city}, ${address.state} ${address.zip}`,
            address.country,
        ].filter(Boolean).join(', ');
        const methodLine = `${method} (${trackingNumber}). Shipped on ${dateShipped}`;

        const rows = [
            { label: 'Shipping address', value: addressLine },
            { label: 'Shipping method', value: methodLine },
        ];

        container.innerHTML = rows.map(({ label, value }) => `
            <div class="returnDetails-shippingRow">
                <dt class="returnDetails-shippingLabel">${escape(label)}</dt>
                <dd class="returnDetails-shippingValue">${escape(value)}</dd>
            </div>`).join('');
    }

    renderItems() {
        const list = this.root.querySelector('[data-return-items]');
        if (!list) return;

        const { items } = this.pageData;

        list.innerHTML = items.map(item => this.itemTemplate(item)).join('');
    }

    itemTemplate(item) {
        const product = (item.lineItemSnapshot && item.lineItemSnapshot.product) || {};
        const name = product.displayName || '';
        const price = (item.pricing && item.pricing.discountedPrice && item.pricing.discountedPrice.formattedV2) || '';
        const resolutionLabel = (item.resolution && item.resolution.requested && item.resolution.requested.label) || '';
        const reason = (item.reasonSnapshot && item.reasonSnapshot.displayName) || '';

        // the return data has no thumbnail URL yet
        const thumbnailUrl = item.thumbnailUrl || '';
        const variant = item.variant || '';

        return `
            <li class="returnDetails-item" data-item-id="${escape(item.entityId)}">
                <div class="returnDetails-itemThumbnailWrapper">
                    <img class="returnDetails-itemThumbnail"
                         src="${escape(thumbnailUrl)}"
                         alt="${escape(name)}">
                </div>
                <div class="returnDetails-itemInfo">
                    <p class="returnDetails-itemName">${escape(name)}</p>
                    ${variant ? `<p class="returnDetails-itemVariant">${escape(variant)}</p>` : ''}
                    <p class="returnDetails-itemPrice">${escape(price)}</p>
                </div>
                <dl class="returnDetails-itemMeta">
                    <div class="returnDetails-itemMetaRow">
                        <dt class="returnDetails-itemMetaLabel">Return Quantity:</dt>
                        <dd class="returnDetails-itemMetaValue">${escape(item.quantity)}</dd>
                    </div>
                    <div class="returnDetails-itemMetaRow">
                        <dt class="returnDetails-itemMetaLabel">Request</dt>
                        <dd class="returnDetails-itemMetaValue">${escape(resolutionLabel)}</dd>
                    </div>
                    <div class="returnDetails-itemMetaRow">
                        <dt class="returnDetails-itemMetaLabel">Reason</dt>
                        <dd class="returnDetails-itemMetaValue">${escape(reason)}</dd>
                    </div>
                </dl>
            </li>`;
    }

    renderSummary() {
        const summary = this.root.querySelector('[data-return-summary]');
        if (!summary) return;

        const { dateSubmitted, lastUpdated, orderId } = this.pageData;
        const rows = [
            { label: 'Submitted:', value: dateSubmitted },
            { label: 'Last update:', value: lastUpdated },
            { label: 'Order#:', value: orderId },
        ];

        summary.innerHTML = rows.map(({ label, value }) => `
            <div class="returnDetails-summaryRow">
                <dt class="returnDetails-summaryLabel">${escape(label)}</dt>
                <dd class="returnDetails-summaryValue">${escape(value)}</dd>
            </div>`).join('');
    }
}
