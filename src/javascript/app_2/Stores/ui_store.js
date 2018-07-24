import {
    action,
    computed,
    observable }            from 'mobx';
import BaseStore            from './base_store';
import { MAX_MOBILE_WIDTH } from '../Constants/ui';

export default class UIStore extends BaseStore {
    @observable is_portfolio_drawer_on     = false;
    @observable is_main_drawer_on          = false;
    @observable is_notifications_drawer_on = false;
    @observable screen_width               = window.innerWidth;

    @observable is_settings_dialog_on = false;
    @observable is_language_dialog_on = false;
    @observable is_dark_mode_on = true;

    // Purchase Controls
    @observable is_purchase_confirm_on = false;
    @observable is_purchase_lock_on = false;

    // SmartCharts Controls
    @observable is_chart_layout_default = false;
    @observable is_chart_asset_info_visible = true;
    @observable is_chart_countdown_visible = false;

    constructor() {
        const local_storage_properties = [
            'is_chart_asset_info_visible',
            'is_chart_countdown_visible',
            'is_chart_layout_default',
            'is_dark_mode_on',
            'is_portfolio_drawer_on',
            'is_purchase_confirm_on',
            'is_purchase_lock_on',
        ];

        super(null, local_storage_properties);
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
    toggleChartLayout() {
        this.is_chart_layout_default = !this.is_chart_layout_default;
    };

    @action.bound
    toggleChartAssetInfo() {
        this.is_chart_asset_info_visible = !this.is_chart_asset_info_visible;
    }

    @action.bound
    toggleChartCountdown() {
        this.is_chart_countdown_visible = !this.is_chart_countdown_visible;
    }

    @action.bound
    togglePurchaseLock() {
        this.is_purchase_lock_on = !this.is_purchase_lock_on;
    }

    @action.bound
    togglePurchaseConfirmation() {
        this.is_purchase_confirm_on = !this.is_purchase_confirm_on;
    }

    @action.bound
    toggleDarkMode() {
        this.is_dark_mode_on = !this.is_dark_mode_on;
    }

    @action.bound
    toggleSettingsDialog() {
        this.is_settings_dialog_on = !this.is_settings_dialog_on;
        if (!this.is_settings_dialog_on) this.is_language_dialog_on = false;
    }

    @action.bound
    showLanguageDialog() {
        this.is_language_dialog_on = true;
    }

    @action.bound
    hideLanguageDialog() {
        this.is_language_dialog_on = false;
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
