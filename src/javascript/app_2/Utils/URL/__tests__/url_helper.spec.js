import { expect }   from 'chai';
import URLHelper    from '../url_helper';

describe('URLHelper', () => {
    let url;
    beforeEach('Setting up url and params', () => {
        url = 'https://www.binary.com/en/trading.html?currency=USD&market=forex';
    });

    describe('.getQueryParams', () => {
        let params;
        beforeEach('Setting up params', () => {
            params = URLHelper.getQueryParams(url);
        });
        it('should return query parameters', () => {
            expect(params.get('currency')).to.eql('USD');
            expect(params.get('market')).to.eql('forex');
        });
        it('should return an object', () => {
            expect(typeof params).to.eql('object');
        });
    });

    describe('.setQueryParam', () => {
        let params;
        beforeEach('Setting up params', () => {
            params = {
                'currency': 'MYR',
                'market': 'forex',
            }
        });
        it('should return an object', () => {
            expect(URLHelper.setQueryParam(params, url)).to.be.a('object');
        });
        it('should return an object with key "currency" to the value of "MYR"', () => {
            expect(URLHelper.setQueryParam(params, url).searchParams.get('currency')).to.eql('MYR');
        });
        it('should return an object with key "market" to the value of "forex"', () => {
            expect(URLHelper.setQueryParam(params, url).searchParams.get('market')).to.eql('forex');
        });

    });
});
