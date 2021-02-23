import { isBrowserIE } from './ie-helpers';

const bannerUtils = {
    dispatchProductBannerEvent: (productAttributes) => {
        if (!productAttributes.price || isBrowserIE) return;

        let price = 0;

        if (!productAttributes.price.price_range) {
            if (productAttributes.price.without_tax) {
                price = productAttributes.price.without_tax.value;
            }

            if (productAttributes.price.with_tax) {
                price = productAttributes.price.with_tax.value;
            }
        }

        const evt = new CustomEvent('bigcommerce.productpricechange', {
            detail: {
                amount: price,
            },
        });

        window.dispatchEvent(evt);
    },
};

export default bannerUtils;
