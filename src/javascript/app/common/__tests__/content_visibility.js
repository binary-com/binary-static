const expect = require('chai').expect;
const { parseAttributeString,
        shouldShowElement } = require('../content_visibility').__test__;

describe('ContentVisibility', () => {
    describe('.parseAttributeString()', () => {
        it('works for a single included', () => {
            expect(parseAttributeString('costarica')).to.deep.equal({
                is_exclude: false,
                names     : ['costarica'],
                mt5_rules : [],
            });
        });
        it('works for two included', () => {
            expect(parseAttributeString('mtcompany, costarica')).to.deep.equal({
                is_exclude: false,
                names     : ['mtcompany', 'costarica'],
                mt5_rules : [],
            });
        });
        it('works for a single excluded', () => {
            expect(parseAttributeString('-costarica')).to.deep.equal({
                is_exclude: true,
                names     : ['costarica'],
                mt5_rules : [],
            });
        });
        it('works for two excluded', () => {
            expect(parseAttributeString('-default, -costarica')).to.deep.equal({
                is_exclude: true,
                names     : ['default', 'costarica'],
                mt5_rules : [],
            });
        });
    });
});
