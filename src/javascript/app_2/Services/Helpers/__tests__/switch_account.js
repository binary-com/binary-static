import { expect } from 'chai';
import { switchAccount } from '../switch_account.js';
import Client from '_common/base/client_base';
import 'mock-local-storage';

describe('switchAccount', () => {

    it('expects empty if no arguments passed', () => {
        expect(switchAccount()).to.be.empty;
    })

    it('expects item set on the session storage', () => {
        switchAccount('2FZQzLdbhLpjLzf');

        expect(Client.get('cashier_confirmed')).to.eql(0);
        expect(Client.get('accepted_bch')).to.eql(0);
        expect(Client.get('loginid')).to.eql('2FZQzLdbhLpjLzf');
    });
});