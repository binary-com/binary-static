import StatementModel from './pages/statement/statement_model';

export default class PagesStore {
    constructor() {
        this.statement = new StatementModel();
    }
};
