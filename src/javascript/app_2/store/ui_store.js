import { observable, action } from 'mobx';

export default class UIStore {
    @observable is_portfolio_drawer_on = false;
    @observable is_main_drawer_on = false;
    @observable is_notifications_drawer_on = false;

    @action.bound togglePortfolioDrawer() { // show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = true;
    };

    @action.bound showMainDrawer() { // show main Drawer
        this.is_main_drawer_on = true;
    };

    @action.bound showNotificationsDrawer() { // show nofitications Drawer
        this.is_notifications_drawer_on = true;
    };

    @action.bound hideDrawers() { // hide both menu drawers
        this.is_main_drawer_on = false;
        this.is_notifications_drawer_on = false;
    };

};
