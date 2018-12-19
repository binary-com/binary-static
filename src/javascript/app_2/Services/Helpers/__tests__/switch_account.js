import { expect } from 'chai';
import { switchAccount } from '../switch_account.js';
import Client from '_common/base/client_base';

global.sessionStorage = window.sessionStorage;
global.localStorage = window.localStorage;

describe('switchAccount', () => {
    const loginid_real = 'MLT79287';
    const loginid_invalid = 'ZZ123456789';

    localStorage.setItem('active_loginid', loginid_real);

    const accounts = {
        MLT79287: {
            'token': "a1-tlJTcyY2mhKCHzkLIk7IwnTM06M4f",
        },
        MF6097: {
            'token': "a1-tlJTcyY2mhKCHzkLIk7IwnTM06M4z",
        }
    };

    localStorage.setItem('client.accounts', JSON.stringify(accounts));

    it('Return nothing when no argument passed or the login id is invalid', () => {
        expect(switchAccount()).to.be.undefined;
        expect(switchAccount(loginid_invalid)).to.be.undefined;
    })

    it('expects GTM event set on local storage', () => {
        switchAccount(loginid_real);
        expect(localStorage.getItem('GTM_login')).to.eq('account_switch');
    })

    it('expects item set on the session storage', () => {
        switchAccount(loginid_real);
        expect(sessionStorage.getItem('active_tab')).to.equal('1');
    });

    it('expects the login id change after switching the acount', () => {
        switchAccount(loginid_real);
        expect(Client.get('loginid', loginid_real)).to.eql(loginid_real);
    });

    it('expects item unset on the localstorage', () => {
        switchAccount(loginid_real);
        expect(Client.get('cashier_confirmed', loginid_real)).to.be.undefined;
        expect(Client.get('accepted_bch', loginid_real)).to.be.undefined;
    })
});