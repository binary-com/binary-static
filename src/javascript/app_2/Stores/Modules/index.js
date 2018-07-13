import StatementStore from './statement_store';
import PortfolioStore from './Portfolio/portfolio_store';
import TradeStore     from './Trading/trade_store';

export default class ModulesStore {
    constructor(root_store) {
        this.statement = new StatementStore();
        this.portfolio = new PortfolioStore();
        this.trade     = new TradeStore(root_store);
    }
};
