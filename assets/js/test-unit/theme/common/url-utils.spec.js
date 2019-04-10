import urlUtil from '../../../theme/common/url-utils';

describe('Url Utilities', () => {
    describe('urlUtils', () => {
        it('should replace parameters in a url', () => {
            const baseUrl = 'http://www.example.com/?foo=bar';
            const expectedUrl = 'http://www.example.com/?foo=bar2&test=someOtherVar';

            const targetUrl = urlUtil.replaceParams(baseUrl, {
                foo: 'bar2',
                test: 'someOtherVar',
            });

            expect(targetUrl).toEqual(expectedUrl);
        });

        it('should build a query string', () => {
            const parameters = {
                foo: ['bar', 'bar2'],
                test: 'someOtherVar',
            };
            const expectedQueryString = 'foo=bar&foo=bar2&test=someOtherVar';
            const queryString = urlUtil.buildQueryString(parameters);

            expect(queryString).toEqual(expectedQueryString);
        });

        it('should parse the input query params from the input array and return the query string object', () => {
            const queryInput = [
                'brand[]=38',
                'brand[]=39',
                'brand[]=40',
                'search_query=',
                'min_price=15',
                'max_price=40',
            ];
            const expectedResult = {
                'brand[]': ['38', '39', '40'],
                max_price: '40',
                min_price: '15',
                search_query: '',
            };
            const queryStringObj = urlUtil.parseQueryParams(queryInput);

            expect(queryStringObj).toEqual(expectedResult);
        });
    });
});
