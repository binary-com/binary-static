import { observable, action } from 'mobx';

export default class UIStore {
    @observable is_portfolio_drawer_on = false;

    @action.bound togglePortfolioDrawer() { // toggle show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = !this.is_portfolio_drawer_on;
    };
};
