const expect = require('chai').expect;
const { parseAttributeString,
        shouldShowElement } = require('../content_visibility').__test__;

describe('ContentVisibility', () => {
    describe('.parseAttributeString()', () => {
        it('works for a single inclusive', () => {
            expect(parseAttributeString('costarica')).to.deep.equal({
                is_exclude: false,
                names     : ['costarica'],
                mt5_rules : [],
            });
        });
        it('works for two inclusive', () => {
            expect(parseAttributeString('mtcompany, costarica')).to.deep.equal({
                is_exclude: false,
                names     : ['mtcompany', 'costarica'],
                mt5_rules : [],
            });
        });
        it('works for a single exclusive', () => {
            expect(parseAttributeString('-costarica')).to.deep.equal({
                is_exclude: true,
                names     : ['costarica'],
                mt5_rules : [],
            });
        });
        it('works for two exclusive', () => {
            expect(parseAttributeString('-default, -costarica')).to.deep.equal({
                is_exclude: true,
                names     : ['default', 'costarica'],
                mt5_rules : [],
            });
        });
        it('works for a single mt5 rule', () => {
            expect(parseAttributeString('mt5:real+vanuatu')).to.deep.equal({
                is_exclude: false,
                names     : [],
                mt5_rules : [['real', 'vanuatu']],
            });
        });
        it('works for a mix of rules', () => {
            expect(parseAttributeString('-maltainvest,  -default, -mt5:real+vanuatu')).to.deep.equal({
                is_exclude: true,
                names     : ['maltainvest', 'default'],
                mt5_rules : [['real', 'vanuatu']],
            });
            expect(parseAttributeString('maltainvest, mt5:real+vanuatu, costarica')).to.deep.equal({
                is_exclude: false,
                names     : ['maltainvest', 'costarica'],
                mt5_rules : [['real', 'vanuatu']],
            });
        });
    });

    describe('.shouldShowElement()', () => {
        it('works with inclusive landing companies', () => {
            expect(shouldShowElement('costarica', 'costarica', false, [])).to.equal(true);
            expect(shouldShowElement('costarica', 'malta', false, [])).to.equal(false);
            expect(shouldShowElement('default, costarica', 'malta', false, [])).to.equal(false);
            expect(shouldShowElement('default, malta', 'maltainvest', false, [])).to.equal(false);
            expect(shouldShowElement('costarica, malta', 'malta', false, [])).to.equal(true);
        });
        it('works with exclusive landing companies', () => {
            expect(shouldShowElement('-costarica', 'costarica', false, [])).to.equal(false);
            expect(shouldShowElement('-costarica', 'malta', false, [])).to.equal(true);
            expect(shouldShowElement('-maltainvest, -costarica', 'malta', false, [])).to.equal(true);
            expect(shouldShowElement('-malta, -maltainvest', 'maltainvest', false, [])).to.equal(false);
            expect(shouldShowElement('-costarica, -malta', 'costarica', false, [])).to.equal(false);
        });
        it('works with inclusive mtcompany check', () => {
            expect(shouldShowElement('mtcompany', 'malta', true, [])).to.equal(true);
            expect(shouldShowElement('malta, mtcompany', 'malta', true, [])).to.equal(true);
            expect(shouldShowElement('maltainvest, mtcompany', 'malta', false, [])).to.equal(false);
        });
        it('works with exclusive mtcompany check', () => {
            expect(shouldShowElement('-mtcompany', 'malta', true, [])).to.equal(false);
            expect(shouldShowElement('-malta, -mtcompany', 'malta', true, [])).to.equal(false);
            expect(shouldShowElement('-maltainvest, -mtcompany', 'malta', false, [])).to.equal(true);
        });
        it('works with inclusive mt5 rule', () => {
            expect(shouldShowElement('mt5:real+vanuatu', 'malta', true, [
                { group: 'real\\costarica' },
                { group: 'demo\\vanuatu_standard' },
            ])).to.equal(false);
            expect(shouldShowElement('mt5:real+vanuatu', 'malta', true, [
                { group: 'real\\vanuatu_advanced' },
                { group: 'demo\\vanuatu_standard' },
            ])).to.equal(true);
        });
        it('works with exclusive mt5 rule', () => {
            expect(shouldShowElement('-mt5:real+costarica', 'malta', true, [
                { group: 'real\\costarica' },
                { group: 'demo\\vanuatu_standard' },
            ])).to.equal(false);
            expect(shouldShowElement('-mt5:real+costarica', 'malta', true, [
                { group: 'real\\vanuatu_advanced' },
                { group: 'demo\\vanuatu_standard' },
            ])).to.equal(true);
        });
    });
});
