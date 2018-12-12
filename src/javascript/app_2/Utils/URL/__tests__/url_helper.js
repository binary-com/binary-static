import { expect } from 'chai';
import URLHelper from '../url_helper';

/*
*   Empty test.
*/

describe('URLHelper', () => {

    describe('.getQueryParams', () => {
        const url = 'https://www.binary.com/en/trading.html?currency=USD&market=forex';
        const params = URLHelper.getQueryParams(url);

        it('should return query parameters', () => {
            expect(params.get('currency')).to.eql('USD');
            expect(params.get('market')).to.eql('forex');
        });
    });

    describe('setQueryParam', () => {
        const url = 'https://www.binary.com/en/trading.html'

        // incomplete
        it('should return a URL object', () => {
            expect(URLHelper.setQueryParam({'currency': 'USD'})).to.eql('');
        });
    });

    describe('updateQueryString', () => {

    });

    describe('pruneQueryString', () => {

    });
});
