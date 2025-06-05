import $ from 'jquery';
import { controlFlow, recommendationsFlow } from './recommendations';
import * as request from './http';
import * as gql from './graphql';
import { STATIC_TOKEN_PARAM, STATIC_TOKEN, RECOM_TOKEN_PARAM } from './constants';
import { mockProducts, testUrl } from './testData';

const addToCartUrls = {
    url1: 'http://some.thing/add?one=1',
    url2: 'http://some.thing/add/',
};
const detailViewUrls = {
    url1: 'http://some.thing/view?one=1',
    url2: 'http://some.thing/view/',
};

const productResultLength = 6;
const recommendationToken = 'arbitrary_recommendation_token';
const mockGetRecommendations = () => () =>
    Promise.resolve({
        results: [{ id: 1 }, { id: 2 }],
        recommendationToken,
    });

const mockGetProducts = (length = 6) => () => Promise.resolve({
    data: {
        site: {
            products: {
                edges: mockProducts(length),
            },
        },
    },
});

const mockDOMElement = (show, hide, html) => ({
    find() {
        return { show, hide };
    },
    html,
});
const defaultOptions = {
    themeSettings: {
        productgallery_size: '50x50',
        show_product_quick_view: true,
    },
    settings: {},
};

describe('Recommendations', () => {
    describe('Recommendations flow', () => {
        let el;
        let showElSpy;
        let hideElSpy;
        let htmlResult;

        beforeEach(() => {
            request.default = jest.fn(mockGetRecommendations());
            gql.default = jest.fn(mockGetProducts(productResultLength));
            showElSpy = jest.fn();
            hideElSpy = jest.fn();
            jest.fn();
            el = mockDOMElement(showElSpy, hideElSpy, (html) => {
                htmlResult = html;
            });
        });

        afterEach(() => {
            htmlResult = undefined;
        });

        it('should show spinner', async () => {
            await recommendationsFlow(el, { ...defaultOptions });
            expect(showElSpy).toBeCalledTimes(1);
        });

        it('should hide spinner in successful case', async () => {
            await recommendationsFlow(el, { ...defaultOptions });
            expect(hideElSpy).toBeCalledTimes(1);
        });

        it('should hide spinner in error case', async () => {
            request.default = jest.fn(() => Promise.reject());
            await recommendationsFlow(el, { ...defaultOptions });
            expect(hideElSpy).toBeCalledTimes(1);
        });

        it('should add recommendation token to urls', async () => {
            await recommendationsFlow(el, { ...defaultOptions });
            const $dom = $(htmlResult);
            $dom.appendTo(document.body);

            const expectedResult = [].concat(...Array.from(Array(productResultLength)).map(() => [
                `${testUrl}?${RECOM_TOKEN_PARAM}=${recommendationToken}`,
                '', // quick view anchor
                `${testUrl}?${RECOM_TOKEN_PARAM}=${recommendationToken}`,
                `${testUrl}?${RECOM_TOKEN_PARAM}=${recommendationToken}`,
            ]));
            expect($dom.find('a').get().map(e => e.href)).toEqual(expectedResult);
            $dom.remove();
        });
    });

    describe('Default flow', () => {
        it('should add static token to all "Add To Cart" and "Detail View" links', () => {

            const html = `<div>
                <a href="${detailViewUrls.url1}" data-token-url="product-detail-page">Detail View 1</a>
                <a href="${addToCartUrls.url1}" data-token-url="add-to-cart">Add To Cart 1</a>
                <a href="${detailViewUrls.url2}" data-token-url="product-detail-page">Detail View 2</a>
                <a href="${addToCartUrls.url2}" data-token-url="add-to-cart">Add To Cart 2</a>
                <a href="${detailViewUrls.url1}" data-without-attr="true">Detail View 3</a>
            </div>`;
            const $element = $(html);
            $element.append(document.body);

            controlFlow($element, { productId: '123' });

            expect($element.find('a').get().map(e => e.href)).toEqual([
                `${detailViewUrls.url1}&${STATIC_TOKEN_PARAM}=${STATIC_TOKEN}`,
                `${addToCartUrls.url1}&${STATIC_TOKEN_PARAM}=${STATIC_TOKEN}`,
                `${detailViewUrls.url2}?${STATIC_TOKEN_PARAM}=${STATIC_TOKEN}`,
                `${addToCartUrls.url2}?${STATIC_TOKEN_PARAM}=${STATIC_TOKEN}`,
                detailViewUrls.url1,
            ]);
            $element.remove();
        });
    });
});
