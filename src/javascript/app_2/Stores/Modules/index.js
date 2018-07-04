import StatementStore from './statement_store';
import TradeStore     from './trade_store';

export default class ModulesStore {
    constructor(root_store) {
        this.statement = new StatementStore(root_store);
        this.trade     = new TradeStore(root_store);
    }
};
