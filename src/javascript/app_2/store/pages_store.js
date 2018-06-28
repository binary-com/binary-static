import SettingsModel from './pages/settings/settings_model';

export default class PagesStore {
    constructor() {
        this.settings = new SettingsModel();
    }
};
