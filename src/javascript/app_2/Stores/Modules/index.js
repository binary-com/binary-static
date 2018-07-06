import StatementStore from './statement_store';
import TradeStore     from './Trading/trade_store';

export default class ModulesStore {
    constructor(root_store) {
        this.statement = new StatementStore();
        this.trade     = new TradeStore(root_store);
    }
};
