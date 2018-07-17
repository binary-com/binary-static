const expect = require('chai').expect;
const { parseAttributeString,
        shouldShowElement } = require('../content_visibility').__test__;

describe('ContentVisibility', () => {
    describe('.parseAttributeString()', () => {
        it('works for a single included landing company', () => {
            expect(parseAttributeString('costarica')).to.deep.equal({
                is_exclude: false,
                names     : ['costarica'],
                mt5_rules : [],
            });
        });
        it('works for a single excluded landing company', () => {
            expect(parseAttributeString('-costarica')).to.deep.equal({
                is_exclude: true,
                names     : ['costarica'],
                mt5_rules : [],
            });
        });
    });
});
