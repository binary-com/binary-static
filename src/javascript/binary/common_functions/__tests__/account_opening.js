const AccountOpening  = require('../account_opening');
const Client          = require('../../base/client');
const State           = require('../../base/storage').State;
const { api, expect } = require('../../base/__tests__/tests_common');
global.$ = require('jquery');


describe('AccountOpening', () => {
    describe('.redirectAccount()', () => {
        let landing_company_de,
            landing_company_jp,
            landing_company_id;
        before(function(done) {
            this.timeout(10000);
            // this is a read token, even if other people take it, won't be able to do any harm
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

        it('will redirect virtual client from Germany to MF page', () => {
            State.set(['response', 'landing_company'], landing_company_de);
            Client.set('is_virtual', 1);
            expect(AccountOpening.redirectAccount()).to.eq(true);
        });
        it('will redirect gaming client to MF page', () => {
            Client.set('is_virtual', 0);
            expect(AccountOpening.redirectAccount()).to.eq(true);
        });
        it('will not redirect client who is already on MF page to MF page again', () => {
            State.set('is_financial_opening', 1);
            expect(AccountOpening.redirectAccount()).to.eq(false);
        });
        State.set('is_financial_opening', 0);

        it('will redirect virtual client from Japan to JP page', () => {
            State.set(['response', 'landing_company'], landing_company_jp);
            Client.set('is_virtual', 1);
            expect(AccountOpening.redirectAccount()).to.eq(true);
        });

        it('will not redirect other clients to MF or JP page', () => {
            State.set(['response', 'landing_company'], landing_company_id);
            expect(AccountOpening.redirectAccount()).to.eq(false);
        });
    });
});
