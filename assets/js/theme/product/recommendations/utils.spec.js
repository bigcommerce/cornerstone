import { addQueryParams } from './utils';

const urls = ['https://test.one/get?one=1', 'https://test.one/'];

describe('Utils', () => {
    it('#addToCartUrls: should return same url if no params added', () => {
        expect(addQueryParams(urls[0])).toEqual(urls[0]);
    });
    it('#addToCartUrls: should add next params', () => {
        expect(addQueryParams(urls[0], { two: 2, three: '3' }))
            .toEqual(`${urls[0]}&two=2&three=3`);
    });
    it('#addToCartUrls: should add first params', () => {
        expect(addQueryParams(urls[1], { two: 2, three: '3' }))
            .toEqual(`${urls[1]}?two=2&three=3`);
    });
    it('#addToCartUrls: should add one param', () => {
        expect(addQueryParams(urls[1], { one: 1 }))
            .toEqual(`${urls[1]}?one=1`);
    });
});
