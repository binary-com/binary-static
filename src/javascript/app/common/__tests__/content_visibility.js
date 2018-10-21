const expect = require('chai').expect;
const { parseAttributeString,
        shouldShowElement } = require('../content_visibility').__test__;

describe('ContentVisibility', () => {
    describe('.parseAttributeString()', () => {
        it('works for a single inclusive', () => {
            expect(parseAttributeString('costarica')).to.deep.equal({
                is_exclude   : false,
                names        : ['costarica'],
                mt5fin_rules : [],
                country_rules: [],
            });
        });
        it('works for two inclusive', () => {
            expect(parseAttributeString('mtcompany, costarica')).to.deep.equal({
                is_exclude   : false,
                names        : ['mtcompany', 'costarica'],
                mt5fin_rules : [],
                country_rules: [],
            });
        });
        it('works for a single exclusive', () => {
            expect(parseAttributeString('-costarica')).to.deep.equal({
                is_exclude   : true,
                names        : ['costarica'],
                mt5fin_rules : [],
                country_rules: [],
            });
        });
        it('works for two exclusive', () => {
            expect(parseAttributeString('-default, -costarica')).to.deep.equal({
                is_exclude   : true,
                names        : ['default', 'costarica'],
                mt5fin_rules : [],
                country_rules: [],
            });
        });
        it('works for a single mt5 rule', () => {
            expect(parseAttributeString('mt5fin:vanuatu')).to.deep.equal({
                is_exclude   : false,
                names        : [],
                mt5fin_rules : ['vanuatu'],
                country_rules: [],
            });
        });
        it('works for a mix of rules', () => {
            expect(parseAttributeString('-maltainvest,  -default, -mt5fin:vanuatu')).to.deep.equal({
                is_exclude   : true,
                names        : ['maltainvest', 'default'],
                mt5fin_rules : ['vanuatu'],
                country_rules: []
            });
            expect(parseAttributeString('maltainvest, mt5fin:vanuatu, costarica')).to.deep.equal({
                is_exclude   : false,
                names        : ['maltainvest', 'costarica'],
                mt5fin_rules : ['vanuatu'],
                country_rules: [],
            });
        });
    });

    describe('.shouldShowElement()', () => {
        it('works with inclusive landing companies', () => {
            expect(shouldShowElement('costarica', true, 'default', 'costarica', false, 'vanuatu')).to.equal(true);
            expect(shouldShowElement('costarica', true, 'default', 'malta', false, 'vanuatu')).to.equal(false);
            expect(shouldShowElement('default, costarica', true, 'default', 'malta', false, '')).to.equal(false);
            expect(shouldShowElement('default, malta', true, 'default', 'maltainvest', false, '')).to.equal(false);
            expect(shouldShowElement('costarica, malta', true, 'default', 'malta', false, '')).to.equal(true);
        });
        it('works with exclusive landing companies', () => {
            expect(shouldShowElement('-costarica', true, 'default', 'costarica', false, 'vanuatu')).to.equal(false);
            expect(shouldShowElement('-costarica', true, 'default', 'malta', false, 'vanuatu')).to.equal(true);
            expect(shouldShowElement('-maltainvest, -costarica', true, 'default', 'malta', false, '')).to.equal(true);
            expect(shouldShowElement('-malta, -maltainvest', true, 'default', 'maltainvest', false, 'vanuatu')).to.equal(false);
            expect(shouldShowElement('-costarica, -malta', true, 'default', 'costarica', false, 'vanuatu')).to.equal(false);
        });
        it('works with inclusive mtcompany check', () => {
            expect(shouldShowElement('mtcompany', 'malta', true, 'default', true, 'vanuatu')).to.equal(true);
            expect(shouldShowElement('malta, mtcompany', true, 'default', 'malta', true, 'vanuatu')).to.equal(true);
            expect(shouldShowElement('maltainvest, mtcompany', true, 'default', 'malta', false, 'vanuatu')).to.equal(false);
        });
        it('works with exclusive mtcompany check', () => {
            expect(shouldShowElement('-mtcompany', true, 'default', 'malta', true, 'vanuatu')).to.equal(false);
            expect(shouldShowElement('-malta, -mtcompany', true, 'default', 'malta', true, 'vanuatu')).to.equal(false);
            expect(shouldShowElement('-maltainvest, -mtcompany', true, 'default', 'malta', false, 'vanuatu')).to.equal(true);
        });
        it('works with inclusive mt5fin rule', () => {
            expect(shouldShowElement('mt5fin:vanuatu', true, 'default', 'malta', true, '')).to.equal(false);
            expect(shouldShowElement('mt5fin:vanuatu', true, 'default', 'malta', true, 'vanuatu')).to.equal(true);
        });
        it('works with exclusive mt5fin rule', () => {
            expect(shouldShowElement('-mt5fin:vanuatu', true, 'default', 'malta', true, 'vanuatu')).to.equal(false);
            expect(shouldShowElement('-mt5fin:vanuatu', true, 'default', 'malta', true, '')).to.equal(true);
        });
        it('works with inclusive country check', () => {
            expect(shouldShowElement('country:mt', false, 'mt', 'default', false)).to.equal(true);
            expect(shouldShowElement('country:mt', false, 'br', 'default', false)).to.equal(false);
        });
        it('works with exclusive country check', () => {
            expect(shouldShowElement('-country:mt', false, 'mt', 'default', false)).to.equal(false);
            expect(shouldShowElement('-country:mt', false, 'br', 'default', false)).to.equal(true);
        });
    });
});
