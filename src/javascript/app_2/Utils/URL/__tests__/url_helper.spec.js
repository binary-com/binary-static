import { expect }   from 'chai';
import URLHelper    from '../url_helper';

describe('URLHelper', () => {
    let url;
    let params;

    beforeEach('Setting up url and params', () => {
        url = 'https://www.binary.com/en/trading.html?currency=USD&market=forex';
    });

    describe('.getQueryParams', () => {
        it('should return query parameters', () => {
            expect(URLHelper.getQueryParams(url).get('currency')).to.eql('USD');
            expect(URLHelper.getQueryParams(url).get('market')).to.eql('forex');
        });
        it('should return an object', () => {
            expect(URLHelper.getQueryParams(url)).to.be.a('object');
        });
    });

    describe('.setQueryParam', () => {
        // TypeError : param_object.sort is not a function
        it('should return an object', () => {
            params = {
                'currency': 'MYR',
                'market': 'forex',
            };
            expect(URLHelper.setQueryParam(params, url)).to.be.a('object');
        });
    });
});
