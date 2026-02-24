export const testUrl = 'https://random.url/one';
const randomNumber = (max = 25) => Math.floor(Math.random() * max);
const randomString = (length = 7) => Math.random().toString(36).substring(length);
const createProduct = (extendObj = {}) => ({
    node: {
        name: randomString(10),
        entityId: randomNumber(100),
        path: testUrl,
        brand: {
            name: randomString(10),
        },
        prices: {
            price: {
                value: randomNumber(),
                currencyCode: '$',
            },
            salePrice: {
                value: randomNumber(),
                currencyCode: '$',
            },
            retailPrice: {
                value: randomNumber(),
                currencyCode: '$',
            },
        },
        categories: {
            edges: [
                {
                    node: {
                        name: randomString(10),
                    },
                },
                {
                    node: {
                        name: randomString(10),
                    },
                },
            ],
        },
        defaultImage: {
            url: testUrl,
        },
        addToCartUrl: testUrl,
        availability: true,
        ...extendObj,
    },
});

// eslint-disable-next-line import/prefer-default-export
export const mockProducts = (length = 0) => Array.from(Array(length)).map(createProduct);
