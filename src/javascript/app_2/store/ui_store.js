import { observable, action } from 'mobx';

export default class UIStore {
    @observable is_portfolio_drawer_on = false;
    @observable is_main_drawer_on = false;

    @action.bound showPortfolioDrawer() { // toggle show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = true;
    };

    @action.bound showMainDrawer() { // toggle show and hide Portfolio Drawer
        this.is_main_drawer_on = true;
    };

    @action.bound hideDrawers() { // toggle show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = false;
        this.is_main_drawer_on = false;
    };
};
