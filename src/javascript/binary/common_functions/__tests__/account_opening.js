const AccountOpening = require('../account_opening');
const Client         = require('../../base/client');
const State          = require('../../base/storage').State;
const Url            = require('../../base/url');
const { api, expect, getApiToken, setURL } = require('../../base/__tests__/tests_common');
global.$ = require('jquery');


describe('AccountOpening', () => {
    describe('.redirectAccount()', () => {
        let landing_company_de,
            landing_company_jp,
            landing_company_id,
            get_settings;
        before(function(done) {
            this.timeout(10000);
            // this is a read token, even if other people take it, won't be able to do any harm
            api.authorize(getApiToken()).then(() => {
                api.getAccountSettings().then((response) => {
                    get_settings = response;
                    api.getLandingCompany('de').then((response) => {
                        landing_company_de = response;
                        api.getLandingCompany('jp').then((response) => {
                            landing_company_jp = response;
                            api.getLandingCompany('id').then((response) => {
                                landing_company_id = response;
                                done();
                            });
                        });
                    });
                });
            });
        });

        it('will redirect virtual client from Germany to MF page', () => {
            State.set(['response', 'get_settings'], get_settings);
            State.set(['response', 'landing_company'], landing_company_de);
            Client.set('is_virtual', 1);
            expect(AccountOpening.redirectAccount()).to.eq(true);
        });
        it('will redirect gaming client to MF page', () => {
            Client.set('is_virtual', 0);
            expect(AccountOpening.redirectAccount()).to.eq(true);
        });
        it('will not redirect client who is already on MF page to MF page again', () => {
            setURL(`${Url.websiteUrl()}en/maltainvestws.html`);
            expect(AccountOpening.redirectAccount()).to.eq(false);
        });
        setURL(`${Url.websiteUrl()}en/home.html`);

        it('will redirect virtual client from Japan to JP page', () => {
            State.set(['response', 'landing_company'], landing_company_jp);
            Client.set('is_virtual', 1);
            expect(AccountOpening.redirectAccount()).to.eq(true);
        });

        it('will redirect other clients to Real page', () => {
            State.set(['response', 'landing_company'], landing_company_id);
            expect(AccountOpening.redirectAccount()).to.eq(true);
        });
    });
});
