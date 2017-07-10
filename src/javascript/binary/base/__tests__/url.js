const expect = require('chai').expect;
const Url    = require('../url');
const setURL = require('./tests_common').setURL;

describe('Url', () => {
    const language     = 'en';
    const query_string = 'market=forex&duration_amount=5&no_value=';
    const params_obj   = { market: 'forex', duration_amount: '5', no_value: '' };
    const url_no_qs    = `${Url.websiteUrl()}${language}/trading.html`;
    const url_with_qs  = `${url_no_qs}?${query_string}`;

    describe('.paramsHash()', () => {
        it('returns correct object', () => {
            expect(Url.paramsHash(url_with_qs)).to.be.an('Object')
                .and.to.have.all.keys('market', 'duration_amount', 'no_value')
                .and.to.deep.equal(params_obj);
        });

        it('returns empty object when there is no query string', () => {
            expect(Url.paramsHash(url_no_qs)).to.be.an('Object')
                .and.to.deep.equal({ });
            expect(Url.paramsHash(`${url_no_qs}?`)).to.be.an('Object')
                .and.to.deep.equal({ });
        });
    });

    describe('.paramsHashToString()', () => {
        it('works for valid object', () => {
            expect(Url.paramsHashToString(params_obj)).to.eq(query_string);
        });

        it('works for empty object or undefined value', () => {
            expect(Url.paramsHashToString({ })).to.eq('');
            expect(Url.paramsHashToString()).to.eq('');
        });
    });

    describe('.urlFor()', () => {
        before(() => { setURL(url_no_qs); });
        const home_url = `${Url.websiteUrl()}${language}/home.html`;

        it('returns correct url', () => {
            [undefined, null, '', '/', 'home'].forEach((path) => {
                expect(Url.urlFor(path)).to.eq(home_url);
            });
        });

        it('works with query string parameters', () => {
            expect(Url.urlFor('trading', query_string)).to.eq(url_with_qs);
        });

        it('ignores invalid characters', () => {
            expect(Url.urlFor('`~!@#$%^&*)(=+\[}{\]\\\"\';:\?><,|')).to.eq(home_url);
        });

        it('handles all valid characters', () => {
            expect(Url.urlFor('metatrader/comparison-4_vs_5'))
                .to.eq(`${Url.websiteUrl()}${language}/metatrader/comparison-4_vs_5.html`);
        });
    });
});
