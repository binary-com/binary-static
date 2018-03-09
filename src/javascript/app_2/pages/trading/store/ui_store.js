import { observable, action } from 'mobx';

export default class UIStore {
    @observable isPortfolioDrawerOn = false;

    @action.bound togglePortfolioDrawer() { // toggle show and hide Portfolio Drawer
        const appLayout = document.getElementById('trade_app');
        appLayout.classList[this.isPortfolioDrawerOn ? 'remove': 'add']('show');
        this.isPortfolioDrawerOn = !this.isPortfolioDrawerOn;
    };
};
