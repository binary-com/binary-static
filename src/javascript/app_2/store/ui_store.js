import { observable, action } from 'mobx';
import { LocalStore } from '../../_common/storage';

export default class UIStore {
    @observable is_portfolio_drawer_on = false;

    @action.bound togglePortfolioDrawer() { // toggle show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = !this.is_portfolio_drawer_on;
    };

    @observable client_accounts = JSON.parse(LocalStore.get('client.accounts'));
    @observable active_loginid  = LocalStore.get('active_loginid');
    @observable active_account  = this.client_accounts[this.active_loginid];
    @observable paymentagent_list = []; // TODO: get payment agent list
};
