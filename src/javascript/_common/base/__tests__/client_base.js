const ClientBase              = require('../client_base');
const setCurrencies           = require('../currency_base').setCurrencies;
const { api, expect, setURL } = require('../../__tests__/tests_common');
const State                   = require('../../storage').State;
const Url                     = require('../../url');

describe('Client', () => {
    const loginid_invalid   = 'ZZ123456789';
    const loginid_virtual   = 'VRTC123456789';
    const loginid_real      = 'CR123456789';
    const loginid_real_2    = 'CR123456788';
    const loginid_real_iom  = 'MX123';
    const loginid_gaming    = 'MLT123';
    const loginid_financial = 'MF123';

    const landing_company = { landing_company: { financial_company: { name: 'Binary Investments (Europe) Ltd', shortcode: 'maltainvest' }, gaming_company: { name: 'Binary (Europe) Ltd', shortcode: 'malta' } }, msg_type: 'landing_company' };
    const authorize       = { authorize: { upgradeable_landing_companies: [] }};

    describe('.validateLoginid()', () => {
        it('can detect a valid loginid', () => {
            [loginid_virtual, loginid_real].forEach((id) => {
                ClientBase.set('loginid', id, id);
                ClientBase.set('token', 'test', id);
                expect(ClientBase.isValidLoginid()).to.eq(true);
            });
        });
        it('can detect an invalid loginid', () => {
            ClientBase.set('loginid', loginid_invalid, loginid_invalid);
            ClientBase.set('token', 'test', loginid_invalid);
            expect(ClientBase.isValidLoginid()).to.eq(false);
        });
        after(() => {
            ClientBase.clearAllAccounts();
        });
    });

    describe('.(set|get)()', () => {
        it('sets and gets for expected client', () => {
            ClientBase.set('currency', 'USD', loginid_virtual);
            ClientBase.set('currency', 'EUR', loginid_real);
            expect(ClientBase.get('currency', loginid_virtual)).to.eq('USD');
            expect(ClientBase.get('currency', loginid_real)).to.eq('EUR');
        });
        it('returns expected data types', () => {
            ClientBase.set('number', 1, loginid_real);
            expect(ClientBase.get('number', loginid_real)).to.be.a('Number').and.to.eq(1);
            ClientBase.set('float', 1.12345, loginid_real);
            expect(ClientBase.get('float', loginid_real)).to.be.a('Number').and.to.eq(1.12345);
            const obj_nested = { a: { b: 'test' } };
            ClientBase.set('object', obj_nested, loginid_real);
            expect(ClientBase.get('object', loginid_real)).to.be.an('Object').and.to.deep.eq(obj_nested);
            ClientBase.set('bool', true, loginid_real);
            expect(ClientBase.get('bool', loginid_real)).to.be.a('boolean').and.to.eq(true);
            ClientBase.set('undef', undefined, loginid_real);
            expect(ClientBase.get('undef', loginid_real)).to.eq(undefined);
        });
    });

    describe('.getAllLoginids()', () => {
        it('works as expected', () => {
            expect(ClientBase.getAllLoginids()).to.deep.eq([ loginid_virtual, loginid_real ]);
        });
    });

    describe('.getAccountType()', () => {
        it('works as expected', () => {
            expect(ClientBase.getAccountType(loginid_virtual)).to.eq('virtual');
            expect(ClientBase.getAccountType(loginid_real)).to.eq(undefined);
            expect(ClientBase.getAccountType(loginid_gaming)).to.eq('gaming');
            expect(ClientBase.getAccountType(loginid_financial)).to.eq('financial');
        });
    });

    describe('.isAccountOfType()', () => {
        it('works as expected', () => {
            expect(ClientBase.isAccountOfType('virtual', loginid_virtual)).to.eq(true);
            expect(ClientBase.isAccountOfType('real', loginid_real)).to.eq(true);
        });
        it('doesn\'t return disabled account if enabled_only flag is set', () => {
            ClientBase.set('is_disabled', 1, loginid_financial);
            expect(ClientBase.isAccountOfType('financial', loginid_financial, 1)).to.eq(false);
        });
    });

    describe('.getAccountOfType()', () => {
        it('works as expected', () => {
            expect(ClientBase.getAccountOfType('virtual').loginid).to.eq(loginid_virtual);
            expect(ClientBase.getAccountOfType('real').loginid).to.eq(loginid_real);
            expect(ClientBase.getAccountOfType('financial').loginid).to.eq(loginid_financial);
        });
        it('doesn\'t return disabled account if enabled_only flag is set', () => {
            expect(ClientBase.getAccountOfType('financial', 1).loginid).to.eq(undefined);
        });
    });

    describe('.hasAccountType()', () => {
        it('works as expected', () => {
            expect(ClientBase.hasAccountType('financial')).to.eq(true);
        });
        it('doesn\'t return disabled account if enabled_only flag is set', () => {
            expect(ClientBase.hasAccountType('financial', 1)).to.eq(false);
        });
    });

    describe('.hasCurrencyType()', () => {
        it('works as expected', () => {
            ClientBase.set('is_virtual', 1, loginid_virtual);
            expect(ClientBase.hasCurrencyType('fiat')).to.eq(loginid_real);
            expect(ClientBase.hasCurrencyType('crypto')).to.eq(undefined);
        });
    });

    describe('.shouldAcceptTnc()', () => {
        it('doesn\'t ask to accept if same version', () => {
            State.set(['response', 'website_status', 'website_status', 'terms_conditions_version'], 1);
            State.set(['response', 'get_settings', 'get_settings', 'client_tnc_status'], 1);
            expect(ClientBase.shouldAcceptTnc()).to.eq(false);
        });
        it('asks to accept if different version', () => {
            State.set(['response', 'website_status', 'website_status', 'terms_conditions_version'], 2);
            expect(ClientBase.shouldAcceptTnc()).to.eq(true);
        });
    });

    describe('.clearAllAccounts()', () => {
        it('works as expected', () => {
            ClientBase.clearAllAccounts();
            expect(ClientBase.get()).to.deep.eq({});
        });
    });

    describe('.currentLandingCompany()', () => {
        it('works as expected', () => {
            State.set(['response', 'landing_company'], landing_company);
            ClientBase.set('landing_company_shortcode', 'malta');
            expect(ClientBase.currentLandingCompany()).to.deep.eq({ name: 'Binary (Europe) Ltd', shortcode: 'malta' });
            ClientBase.set('landing_company_shortcode', 'maltainvest');
            expect(ClientBase.currentLandingCompany()).to.deep.eq({ name: 'Binary Investments (Europe) Ltd', shortcode: 'maltainvest' });
            ClientBase.set('landing_company_shortcode', 'virtual');
            expect(ClientBase.currentLandingCompany()).to.deep.eq({});
        });
    });

    describe('.getBasicUpgradeInfo()', () => {
        it('returns false if client can\'t upgrade', () => {
            State.set(['response', 'authorize'], authorize);
            expect(ClientBase.getBasicUpgradeInfo().can_upgrade).to.eq(false);
        });
        it('returns as expected for accounts that can upgrade to real', () => {
            ['costarica', 'malta', 'iom'].forEach((lc) => {
                State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], [ lc ]);
                const ugprade_info = ClientBase.getBasicUpgradeInfo();
                expect(ugprade_info.can_upgrade).to.eq(true);
                expect(ugprade_info.type).to.eq('real');
                expect(ugprade_info.can_open_multi).to.eq(false);
            });
        });
        it('returns as expected for accounts that can upgrade to financial', () => {
            State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], [ 'maltainvest' ]);
            const ugprade_info = ClientBase.getBasicUpgradeInfo();
            expect(ugprade_info.can_upgrade).to.eq(true);
            expect(ugprade_info.type).to.eq('financial');
            expect(ugprade_info.can_open_multi).to.eq(false);
        });
        it('returns as expected for multi account opening', () => {
            State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], [ 'costarica' ]);
            ClientBase.set('landing_company_shortcode', 'costarica');
            const ugprade_info = ClientBase.getBasicUpgradeInfo();
            expect(ugprade_info.can_upgrade).to.eq(false);
            expect(ugprade_info.type).to.eq(undefined);
            expect(ugprade_info.can_open_multi).to.eq(true);
        });
    });

    describe('.getLandingCompanyValue()', () => {
        it('works as expected', () => {
            expect(ClientBase.getLandingCompanyValue(loginid_financial, landing_company.landing_company, 'name')).to.eq(landing_company.landing_company.financial_company.name);
            expect(ClientBase.getLandingCompanyValue(loginid_gaming, landing_company.landing_company, 'name')).to.eq(landing_company.landing_company.gaming_company.name);
        });
    });

    describe('.canTransferFunds()', () => {
        before(function (done) {
            this.timeout(5000);
            api.getWebsiteStatus().then((response) => {
                setCurrencies(response.website_status);
                done();
            });
        });
        it('fails if client has maltainvest and malta accounts with one missing currency', () => {
            ClientBase.clearAllAccounts();
            [loginid_gaming, loginid_financial].forEach((id) => {
                ClientBase.set('loginid', id, id);
            });
            ClientBase.set('landing_company_shortcode', 'maltainvest', loginid_financial);
            ClientBase.set('landing_company_shortcode', 'malta', loginid_gaming);

            ClientBase.set('currency', 'USD', loginid_gaming);

            expect(ClientBase.canTransferFunds()).to.eq(false);
        });
        it('fails if client has maltainvest and malta accounts with differing currencies', () => {
            ClientBase.set('currency', 'USD', loginid_gaming);
            ClientBase.set('currency', 'EUR', loginid_financial);

            expect(ClientBase.canTransferFunds()).to.eq(false);
        });
        it('passes if client has maltainvest and malta accounts with the same currency', () => {
            ClientBase.set('currency', 'USD', loginid_gaming);
            ClientBase.set('currency', 'USD', loginid_financial);

            expect(ClientBase.canTransferFunds()).to.eq(true);
        });
        it('fails if maltainvest and non-malta client even if same currency', () => {
            ClientBase.clearAllAccounts();
            [loginid_real_iom, loginid_financial].forEach((id) => {
                ClientBase.set('loginid', id, id);
            });
            ClientBase.set('landing_company_shortcode', 'iom', loginid_real_iom);
            ClientBase.set('landing_company_shortcode', 'maltainvest', loginid_financial);

            ClientBase.set('currency', 'USD', loginid_real_iom);
            ClientBase.set('currency', 'USD', loginid_financial);

            expect(ClientBase.canTransferFunds()).to.eq(false);
        });
        it('fails if non-maltainvest client only has fiat accounts', () => {
            ClientBase.clearAllAccounts();
            [loginid_real, loginid_real_2].forEach((id) => {
                ClientBase.set('loginid', id, id);
            });
            ClientBase.set('currency', 'USD', loginid_real);
            ClientBase.set('currency', 'EUR', loginid_real_2);

            expect(ClientBase.canTransferFunds()).to.eq(false);
        });
        it('fails if non-maltainvest client only has crypto accounts', () => {
            ClientBase.set('currency', 'BTC', loginid_real);
            ClientBase.set('currency', 'ETH', loginid_real_2);

            expect(ClientBase.canTransferFunds()).to.eq(false);
        });
        it('passes if non-maltainvest client has fiat and crypto accounts', () => {
            ClientBase.set('currency', 'USD', loginid_real);
            ClientBase.set('currency', 'BTC', loginid_real_2);

            expect(ClientBase.canTransferFunds()).to.eq(true);
        });
        after(() => {
            ClientBase.clearAllAccounts();
        });
    });

    describe('.hasCostaricaAccount()', () => {
        it('works as expected', () => {
            ClientBase.set('loginid', loginid_financial, loginid_financial);
            ClientBase.set('token', 'test', loginid_financial);
            expect(ClientBase.hasCostaricaAccount()).to.eq(false);
            ClientBase.set('loginid', loginid_real, loginid_real);
            ClientBase.set('token', 'test', loginid_real);
            expect(ClientBase.hasCostaricaAccount()).to.eq(true);
        });
    });

    after(() => {
        setURL(`${Url.websiteUrl()}en/home.html`);
        ClientBase.clearAllAccounts();
    });
});
