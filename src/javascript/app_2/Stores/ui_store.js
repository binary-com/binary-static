import {
    action,
    computed,
    observable }            from 'mobx';
import { MAX_MOBILE_WIDTH } from '../Constants/ui';

export default class UIStore {
    @observable is_portfolio_drawer_on     = false;
    @observable is_main_drawer_on          = false;
    @observable is_notifications_drawer_on = false;
    @observable screen_width               = window.innerWidth;

    constructor() {
        window.addEventListener('resize', this.updateScreenWidth);
    }

    @action.bound
    updateScreenWidth() {
        this.screen_width = window.innerWidth;
    }

    @computed
    get is_mobile() {
        return this.screen_width <= MAX_MOBILE_WIDTH;
    }

    @action.bound
    togglePortfolioDrawer() { // show and hide Portfolio Drawer
        this.is_portfolio_drawer_on = !this.is_portfolio_drawer_on;
    };

    @action.bound
    showMainDrawer() { // show main Drawer
        this.is_main_drawer_on = true;
    };

    @action.bound
    showNotificationsDrawer() { // show nofitications Drawer
        this.is_notifications_drawer_on = true;
    };

    @action.bound
    hideDrawers() { // hide both menu drawers
        this.is_main_drawer_on = false;
        this.is_notifications_drawer_on = false;
    };
};
