import { expect }   from 'chai';
import URLHelper    from '../url_helper';

describe('URLHelper', () => {
    describe('.getQueryParams', () => {
        const url = 'https://www.binary.com/en/trading.html?currency=USD&market=forex';
        const params = URLHelper.getQueryParams(url);

        it('should return query parameters', () => {
            expect(params.get('currency')).to.eql('USD');
            expect(params.get('market')).to.eql('forex');
        });
    });

    describe('.setQueryParam', () => {
        const url = 'https://www.binary.com/en/trading.html?currency=USD&market=forex';
        const params = {
            'currency': 'MYR',
            'market': 'forex',
        }

        // TypeError : param_object.sort is not a function
        it('should return a URL object', () => {
            var result = URLHelper.setQueryParam(params, url);
        });
    });
});
