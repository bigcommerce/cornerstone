import { escape } from 'lodash';
import PageManager from './page-manager';

export default class ReturnDetails extends PageManager {
    onReady() {
        const root = document.querySelector('[data-return-details]');
        if (!root) return;

        this.root = root;

        // ---------------------------------------------------------------------------
        // Hardcoded page data which mirrors the returns-ui Return / Item interface
        // Replace with the relevant stencil page context when it is surfaced.
        // ---------------------------------------------------------------------------
        this.pageData = {
            id: '101',
            rma: '101',
            status: 'OPEN',
            opened: 'January 1, 2024',
            lastUpdated: 'January 1, 2024',
            order: {
                id: '222',
                currency: 'USD',
            },
            shipping: {
                address: {
                    fullName: 'John Doe',
                    address1: '1000 San Marcos Ave',
                    city: 'Austin',
                    state: 'TX',
                    zip: '78702',
                    country: 'United States',
                },
                method: 'UPS Ground',
                trackingNumber: '1Z370170375602560',
                dateShipped: 'May 15, 2024',
            },
            items: [
                {
                    id: 'i1',
                    lineItemId: 'li1',
                    name: 'Product Name',
                    variant: 'Color: Blue · Size: Large',
                    thumbnailUrl: 'https://via.placeholder.com/72',
                    sku: 'SKU-001',
                    requestedResolution: { type: 'system', label: 'Exchange' },
                    requestedReason: 'Wrong item received',
                    quantity: 1,
                    formatted_price: '$123.99',
                    status: 'open',
                },
                {
                    id: 'i2',
                    lineItemId: 'li2',
                    name: 'Product Name',
                    variant: 'Color: Blue · Size: Large',
                    thumbnailUrl: 'https://via.placeholder.com/72',
                    sku: 'SKU-002',
                    requestedResolution: { type: 'system', label: 'Refund' },
                    requestedReason: 'Did not like',
                    quantity: 1,
                    formatted_price: '$123.99',
                    status: 'open',
                },
                {
                    id: 'i3',
                    lineItemId: 'li3',
                    name: 'Product Name',
                    variant: 'Color: Blue · Size: Large',
                    thumbnailUrl: 'https://via.placeholder.com/72',
                    sku: 'SKU-003',
                    requestedResolution: { type: 'system', label: 'Refund' },
                    requestedReason: 'Did not like',
                    quantity: 1,
                    formatted_price: '$123.99',
                    status: 'open',
                },
            ],
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
            // Map the raw status enum to the localized label injected by the
            // template (same labels as the returns list); fall back to the raw value.
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

        const { address, method, trackingNumber, dateShipped } = this.pageData.shipping;
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
        const resolutionLabel = item.requestedResolution ? item.requestedResolution.label : '';

        return `
            <li class="returnDetails-item" data-item-id="${escape(item.id)}">
                <div class="returnDetails-itemThumbnailWrapper">
                    <img class="returnDetails-itemThumbnail"
                         src="${escape(item.thumbnailUrl)}"
                         alt="${escape(item.name)}">
                </div>
                <div class="returnDetails-itemInfo">
                    <p class="returnDetails-itemName">${escape(item.name)}</p>
                    ${item.variant ? `<p class="returnDetails-itemVariant">${escape(item.variant)}</p>` : ''}
                    <p class="returnDetails-itemPrice">${escape(item.formatted_price)}</p>
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
                        <dd class="returnDetails-itemMetaValue">${escape(item.requestedReason)}</dd>
                    </div>
                </dl>
            </li>`;
    }

    renderSummary() {
        const summary = this.root.querySelector('[data-return-summary]');
        if (!summary) return;

        const { opened, lastUpdated, order } = this.pageData;
        const rows = [
            { label: 'Submitted:', value: opened },
            { label: 'Last update:', value: lastUpdated },
            { label: 'Order#:', value: order.id },
        ];

        summary.innerHTML = rows.map(({ label, value }) => `
            <div class="returnDetails-summaryRow">
                <dt class="returnDetails-summaryLabel">${escape(label)}</dt>
                <dd class="returnDetails-summaryValue">${escape(value)}</dd>
            </div>`).join('');
    }
}
