import { expect } from 'chai';
import { switchAccount } from '../switch_account.js';
import Client from '_common/base/client_base';
import { LocalStore, SessionStore } from '../../../../_common/storage.js';

global.sessionStorage = window.sessionStorage;
global.localStorage = window.localStorage;

describe('switchAccount', () => {
    const loginid_real = 'MLT79287';
    const loginid_invalid = 'ZZ123456789';

    LocalStore.set('active_loginid', loginid_real);
    LocalStore.set('config.app_id', 1098);

    it('Return nothing when no argument passed or the login id is invalid', () => {
        expect(switchAccount()).to.be.undefined;
        expect(switchAccount(loginid_invalid)).to.be.undefined;
    });

    it('Return nothing when token is not set', () => {
        expect(switchAccount(loginid_real)).to.be.undefined;
    });

    it('expects GTM event set on local storage', () => {
        Client.set('token', 'a1-tlJTcyY2mhKCHzkLIk7IwnTM06M4f', loginid_real);
        switchAccount(loginid_real);
        expect(LocalStore.get('GTM_login')).to.eq('account_switch');
    });

    it('expects item set on the session storage', () => {
        switchAccount(loginid_real);
        expect(SessionStore.get('active_tab')).to.equal('1');
    });

    it('expects the login id change after switching the account', () => {
        switchAccount(loginid_real);
        expect(Client.get('loginid', loginid_real)).to.eql(loginid_real);
    });

    it('expects item unset on the localstorage', () => {
        switchAccount(loginid_real);
        expect(Client.get('cashier_confirmed', loginid_real)).to.be.false;
        expect(Client.get('accepted_bch', loginid_real)).to.be.false;
    })
});