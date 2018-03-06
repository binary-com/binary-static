const expect = require('chai').expect;
const QueryString = require('../scroll_to_anchor');

describe('QueryString', () => {
    describe('.queryStringToObject', () => {
        it('parses query with single parameter', () => {
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
});