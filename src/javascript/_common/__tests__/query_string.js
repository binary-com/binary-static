const expect = require('chai').expect;
const QueryString = require('../query_string');

describe('QueryString', () => {
    describe('.queryStringToObject', () => {
        it('returns empty object for empty string', () => {
            expect(QueryString.queryStringToObject('')).to.deep.eq({});
        });
        it('parses query with a single parameter', () => {
            expect(QueryString.queryStringToObject('?anchor=otc')).to.deep.eq({
                anchor: 'otc',
            });
        });
        it('parses query with multiple parameters', () => {
            expect(QueryString.queryStringToObject('?anchor=otc&param2=42')).to.deep.eq({
                anchor: 'otc',
                param2: '42',
            });
            expect(QueryString.queryStringToObject('?param2=42&anchor=otc')).to.deep.eq({
                anchor: 'otc',
                param2: '42',
            });
        })
    });

    describe('.queryObjectToString', () => {
        it('returns empty string for empty object', () => {
            expect(QueryString.queryObjectToString({})).to.eq('');
        })
        it('works for single parameter', () => {
            expect(QueryString.queryObjectToString({
                anchor: 'test'
            })).to.eq('?anchor=test');
        });
        it('works for multiple parameters', () => {
            expect(QueryString.queryObjectToString({
                a: 1,
                b: 'test',
                c: 123
            })).to.eq('?a=1&b=test&c=123');
        });
    });

    describe('.removeParamFromQueryString', () => {
        it('works for empty query', () => {
            expect(QueryString.removeParamFromQueryString('', 'anchor')).to.eq('');
        });
        it('doesn\'t modify query without specified key', () => {
            expect(QueryString.removeParamFromQueryString('?a=123', 'anchor')).to.eq('?a=123');
            expect(QueryString.removeParamFromQueryString('?a=123&b=test', 'anchor')).to.eq('?a=123&b=test');
        });
        it('removes specified key value pair', () => {
            expect(QueryString.removeParamFromQueryString('?anchor=NZT', 'anchor')).to.eq('');
            expect(QueryString.removeParamFromQueryString('?a=Hello%20World&b=10', 'a')).to.eq('?b=10');
        });
    });
});