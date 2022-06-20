import { createRequestSender } from '@bigcommerce/request-sender';

const INTERNAL_USE_ONLY = 'This API endpoint is for internal use only and may change in the future';

const requester = createRequestSender();

const loadPaymentMethods = () => {
    const url = '/api/storefront/payments';

    return requester.get(url, {
        headers: {
            Accept: 'application/vnd.bc.v1+json',
            'X-API-INTERNAL': INTERNAL_USE_ONLY,
        },
    });
};

export { loadPaymentMethods };

