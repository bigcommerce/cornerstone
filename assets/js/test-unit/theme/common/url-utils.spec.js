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
    });
});
