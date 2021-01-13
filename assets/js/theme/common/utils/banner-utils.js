import { isBrowserIE } from './ie-helpers';

const bannerUtils = {
    dispatchProductBannerEvent: (productAttributes) => {
        let price = 0;

        if (!productAttributes.price || isBrowserIE) return;

        if (productAttributes.price.without_tax && !productAttributes.price.price_range) {
            price = productAttributes.price.without_tax.value;
        }

        if (productAttributes.price.with_tax && !productAttributes.price.price_range) {
            price = productAttributes.price.with_tax.value;
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
