import { observable, action } from 'mobx';

export default class UIStore {
    @observable is_portfolio_drawer_on = false;
    @observable is_main_drawer_on = false;

    @action.bound togglePortfolioDrawer() { // toggle show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = !this.is_portfolio_drawer_on;
    };

    @action.bound showPortoflioDrawer() { // toggle show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = true;
    };

    @action.bound hidePortfolioDrawer() { // toggle show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = false;
    };

    @action.bound toggleMainDrawer() { // toggle show and hide Portfolio Drawer
        this.is_main_drawer_on = !this.is_main_drawer_on;
    };

    @action.bound showMainDrawer() { // toggle show and hide Portfolio Drawer
        this.is_main_drawer_on = true;
    };
    @action.bound hideMainDrawer() { // toggle show and hide Portfolio Drawer
        this.is_main_drawer_on = false
    };
};
