const { expect, setURL } = require('./tests_common');
const Url                = require('../url');

describe('Url', () => {
    const website_url  = Url.websiteUrl();
    const language     = 'en';
    const query_string = 'market=forex&duration_amount=5&no_value=';
    const params_obj   = { market: 'forex', duration_amount: '5', no_value: '' };
    const url_no_qs    = `${website_url}${language}/trading.html`;
    const url_with_qs  = `${url_no_qs}?${query_string}`;
    const home_url     = `${website_url}${language}/home.html`;

    describe('.paramsHash()', () => {
        it('returns correct object', () => {
            expect(Url.paramsHash(url_with_qs)).to.be.an('Object')
                .and.to.have.all.keys('market', 'duration_amount', 'no_value')
                .and.to.deep.equal(params_obj);
        });
        it('returns empty object when there is no query string', () => {
            expect(Url.paramsHash(url_no_qs)).to.be.an('Object')
                .and.to.deep.equal({});
            expect(Url.paramsHash(`${url_no_qs}?`)).to.be.an('Object')
                .and.to.deep.equal({});
            setURL(url_no_qs);
            expect(Url.paramsHash()).to.deep.eq({});
        });
    });

    describe('.getLocation()', () => {
        it('works as expected', () => {
            expect(Url.getLocation().hostname).to.eq('www.binary.com');
        });
    });

    describe('.paramsHashToString()', () => {
        it('returns an empty string if empty object or undefined passed', () => {
            expect(Url.paramsHashToString({})).to.eq('');
            expect(Url.paramsHashToString()).to.eq('');
        });
        it('returns the expected conversion of object to string', () => {
            expect(Url.paramsHashToString(params_obj)).to.eq(query_string);
        });
    });

    describe('.urlFor()', () => {
        it('returns home as default', () => {
            [undefined, null, '', '/', 'home'].forEach((path) => {
                expect(Url.urlFor(path)).to.eq(home_url);
            });
        });
        it('accepts params', () => {
            expect(Url.urlFor('trading', query_string)).to.eq(url_with_qs);
        });
        it('returns the correct language', () => {
            expect(Url.urlFor('home', undefined, 'es')).to.eq(`${website_url}es/home.html`);
        });
        it('ignores invalid characters', () => {
            expect(Url.urlFor('`~!@#$%^&*)(=+\[}{\]\\\"\';:\?><,|')).to.eq(home_url);
        });
        it('handles all valid characters', () => {
            expect(Url.urlFor('metatrader/comparison-4_vs_5'))
                .to.eq(`${website_url}${language}/metatrader/comparison-4_vs_5.html`);
        });
    });

    describe('.urlForStatic()', () => {
        it('returns base path as default', () => {
            expect(Url.urlForStatic()).to.eq(website_url);
        });
        it('returns expected path', () => {
            expect(Url.urlForStatic('images/common/plus.svg')).to.eq(`${website_url}images/common/plus.svg`);
        });
    });

    describe('.param()', () => {
        it('returns undefined if no match', () => {
            setURL(url_with_qs);
            expect(Url.param()).to.eq(undefined);
        });
        it('returns expected parameter', () => {
            expect(Url.param('duration_amount')).to.be.a('string').and.eq('5');
            expect(Url.param('no_value')).to.be.a('string').and.eq('');
        });
    });

    describe('.websiteUrl()', () => {
        it('returns expected value', () => {
            expect(website_url).to.eq('https://www.binary.com/');
        });
    });
});
