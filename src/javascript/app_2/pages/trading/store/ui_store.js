import { observable, action } from 'mobx';

export default class UIStore {
    @observable is_portfolio_drawer_on = false;

    @action.bound togglePortfolioDrawer() { // toggle show and hide Portfolio Drawer
        const appLayout = document.getElementById('trade_app');
        appLayout.classList[this.is_portfolio_drawer_on ? 'remove': 'add']('show');
        this.is_portfolio_drawer_on = !this.is_portfolio_drawer_on;
    };
};
