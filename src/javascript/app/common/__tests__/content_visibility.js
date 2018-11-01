const expect = require('chai').expect;
const { parseAttributeString,
        shouldShowElement } = require('../content_visibility').__test__;

describe('ContentVisibility', () => {
    describe('.parseAttributeString()', () => {
        it('works for a single inclusive', () => {
            expect(parseAttributeString('costarica')).to.deep.equal({
                is_exclude  : false,
                names       : ['costarica'],
                mt5fin_rules: [],
            });
        });
        it('works for two inclusive', () => {
            expect(parseAttributeString('mtcompany, costarica')).to.deep.equal({
                is_exclude  : false,
                names       : ['mtcompany', 'costarica'],
                mt5fin_rules: [],
            });
        });
        it('works for a single exclusive', () => {
            expect(parseAttributeString('-costarica')).to.deep.equal({
                is_exclude  : true,
                names       : ['costarica'],
                mt5fin_rules: [],
            });
        });
        it('works for two exclusive', () => {
            expect(parseAttributeString('-default, -costarica')).to.deep.equal({
                is_exclude  : true,
                names       : ['default', 'costarica'],
                mt5fin_rules: [],
            });
        });
        it('works for a single mt5 rule', () => {
            expect(parseAttributeString('mt5fin:vanuatu')).to.deep.equal({
                is_exclude  : false,
                names       : [],
                mt5fin_rules: ['vanuatu'],
            });
        });
        it('works for a mix of rules', () => {
            expect(parseAttributeString('-maltainvest,  -default, -mt5fin:vanuatu')).to.deep.equal({
                is_exclude  : true,
                names       : ['maltainvest', 'default'],
                mt5fin_rules: ['vanuatu'],
            });
            expect(parseAttributeString('maltainvest, mt5fin:vanuatu, costarica')).to.deep.equal({
                is_exclude  : false,
                names       : ['maltainvest', 'costarica'],
                mt5fin_rules: ['vanuatu'],
            });
        });
    });

    describe('.shouldShowElement()', () => {
        it('works with inclusive landing companies', () => {
            expect(shouldShowElement('costarica', {
                landing_company_shortcode: 'costarica',
                client_has_mt_company: false,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(true);
            expect(shouldShowElement('costarica', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: false,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(false);
            expect(shouldShowElement('default, costarica', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: false,
                mt_financial_shortocde: ''
            })).to.equal(false);
            expect(shouldShowElement('default, malta', {
                landing_company_shortcode: 'maltainvest',
                client_has_mt_company: false,
                mt_financial_shortocde: ''
            })).to.equal(false);
            expect(shouldShowElement('costarica, malta', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: false,
                mt_financial_shortocde: ''
            })).to.equal(true);
        });
        it('works with exclusive landing companies', () => {
            expect(shouldShowElement('-costarica', {
                landing_company_shortcode: 'costarica',
                client_has_mt_company: false,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(false);
            expect(shouldShowElement('-costarica', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: false,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(true);
            expect(shouldShowElement('-maltainvest, -costarica', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: false,
                mt_financial_shortocde: ''
            })).to.equal(true);
            expect(shouldShowElement('-malta, -maltainvest', {
                landing_company_shortcode: 'maltainvest',
                client_has_mt_company: false,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(false);
            expect(shouldShowElement('-costarica, -malta', {
                landing_company_shortcode: 'costarica',
                client_has_mt_company: false,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(false);
        });
        it('works with inclusive mtcompany check', () => {
            expect(shouldShowElement('mtcompany', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: true,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(true);
            expect(shouldShowElement('malta, mtcompany', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: true,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(true);
            expect(shouldShowElement('maltainvest, mtcompany', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: false,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(false);
        });
        it('works with exclusive mtcompany check', () => {
            expect(shouldShowElement('-mtcompany', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: true,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(false);
            expect(shouldShowElement('-malta, -mtcompany', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: true,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(false);
            expect(shouldShowElement('-maltainvest, -mtcompany', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: false,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(true);
        });
        it('works with inclusive mt5fin rule', () => {
            expect(shouldShowElement('mt5fin:vanuatu', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: true,
                mt_financial_shortocde: ''
            })).to.equal(false);
            expect(shouldShowElement('mt5fin:vanuatu', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: true,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(true);
        });
        it('works with exclusive mt5fin rule', () => {
            expect(shouldShowElement('-mt5fin:vanuatu', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: true,
                mt_financial_shortocde: 'vanuatu'
            })).to.equal(false);
            expect(shouldShowElement('-mt5fin:vanuatu', {
                landing_company_shortcode: 'malta',
                client_has_mt_company: true,
                mt_financial_shortocde: ''
            })).to.equal(true);
        });
    });
});