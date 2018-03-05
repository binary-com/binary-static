const expect = require('chai').expect;
const ScrollToAnchor = require('../scroll_to_anchor');

describe('ScrollToAnchor', () => {
    describe('.getQueryObject', () => {
        it('parses query with single parameter', () => {
            expect(ScrollToAnchor.getQueryObject('?anchor=otc')).to.deep.eq({
                anchor: 'otc',
            });
        });
        it('parses query with multiple parameters', () => {
            expect(ScrollToAnchor.getQueryObject('?anchor=otc&param2=42')).to.deep.eq({
                anchor: 'otc',
                param2: '42',
            });
            expect(ScrollToAnchor.getQueryObject('?param2=42&anchor=otc')).to.deep.eq({
                anchor: 'otc',
                param2: '42',
            });
        })
    });
});