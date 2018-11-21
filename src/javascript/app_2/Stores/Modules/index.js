import ContractStore   from './Contract/contract_store';
import PortfolioStore  from './Portfolio/portfolio_store';
import SmartChartStore from './SmartChart/smart_chart_store';
import StatementStore  from './Statement/statement_store';
import TradeStore      from './Trading/trade_store';

export default class ModulesStore {
    constructor(root_store) {
        this.contract    = new ContractStore({ root_store });
        this.portfolio   = new PortfolioStore({ root_store });
        this.smart_chart = new SmartChartStore({ root_store });
        this.statement   = new StatementStore();
        this.trade       = new TradeStore({ root_store });
    }
}
