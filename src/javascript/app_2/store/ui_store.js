import { observable, action } from 'mobx';

export default class UIStore {
    @observable is_portfolio_drawer_on = false;
    @observable is_main_drawer_on = false;
    @observable is_notifications_drawer_on = false;
    @observable is_settings_dialog_on = false;
    @observable is_language_dialog_on = false;

    // TO-DO - Get language list from config file
    @observable supported_languages = {
        languages: [
            { id: 'EN',    name: 'English'    },
            { id: 'PT',    name: 'Português'  },
            { id: 'DE',    name: 'Deutsch'    },
            { id: 'RU',    name: 'Русский'    },
            { id: 'FR',    name: 'Français'   },
            { id: 'TH',    name: 'Thai'       },
            { id: 'ID',    name: 'Indonesia'  },
            { id: 'VI',    name: 'Tiếng Việt' },
            { id: 'IT',    name: 'Italiano'   },
            { id: 'ZH_CN', name: '简体中文'    },
            { id: 'ES',    name: 'Espana'     },
            { id: 'ZH_TW', name: '繁體中文'    },
            { id: 'PL',    name: 'Polish'     },
        ],
    };

    @action.bound toggleSettingsDialog() {
        this.is_settings_dialog_on = !this.is_settings_dialog_on;
    }

    @action.bound showLanguageDialog() {
        this.is_language_dialog_on = true;
    }

    @action.bound hideLanguageDialog() {
        this.is_language_dialog_on = false;
    }

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
