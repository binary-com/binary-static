import SettingsModel from './models/settings/settings_model';
import StatementModel from './models/statement/statement_model';

export default class PagesStore {
    constructor() {
        this.settings = new SettingsModel();
        this.statement = new StatementModel();
    }
};
