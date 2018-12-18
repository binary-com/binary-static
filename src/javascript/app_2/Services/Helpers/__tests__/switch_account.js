import { expect } from 'chai';
import 'mock-local-storage'
import { switchAccount } from '../switch_account.js';
import Client from '_common/base/client_base';
import 'mock-local-storage'

describe('switchAccount', () => {
    it('expects item set on the session storage', () => {
        switchAccount('2FZQzLdbhLpjLzf');

        expect(sessionStorage.getItem('active_tab')).to.eql('1');
        expect(Client.get('cashier_confirmed')).to.eql(0);
        expect(Client.get('accepted_bch')).to.eql(0);
        expect(Client.get('loginid')).to.eql('2FZQzLdbhLpjLzf');
    });
});