import {
    action,
    computed,
    observable }                 from 'mobx';
import { formatPortfolioData }   from './Helpers/process_data';
import BaseStore                 from '../../base_store';
import { WS }                    from '../../../Services';
import { getPropertyValue }      from '../../../../_common/utility';

export default class StatementStore extends BaseStore {
    @observable data       = [];
    @observable is_loading = false;
    @observable error      = '';

    @action.bound
    initializePortfolio = () => {
        this.is_loading = true;

        WS.portfolio().then((response) => {
            this.is_loading = false;
            this.updatePortfolio(response);
        });
        WS.subscribeTransaction(this.transactionResponseHandler, false);
    };

    @action.bound
    clearTable() {
        this.data       = [];
        this.is_loading = false;
        this.error      = '';
    }

    @action.bound
    transactionResponseHandler = (response) => {
        if (getPropertyValue(response, 'error')) {
            this.error = response.error.message;
        }
        WS.portfolio().then((res) => this.updatePortfolio(res));
    };

    @action.bound
    updateIndicative(response) {
        if (getPropertyValue(response, 'error')) {
            return;
        }
        let data_source = this.data.slice();
        const proposal  = response.proposal_open_contract;
        // TODO: find how it is done in current binary-static
        // force to sell the expired contract, in order to remove from portfolio
        if (+proposal.is_settleable === 1 && !proposal.is_sold) {
            WS.sellExpired();
        }
        if (proposal.is_sold) {
            data_source = data_source.filter((portfolio_position) => portfolio_position.id !== +proposal.contract_id);
        } else {
            const portfolio_position = data_source.find((portfolio_position) => portfolio_position.id === +proposal.contract_id);
            const prev_indicative = portfolio_position.indicative;
            const new_indicative  = proposal.bid_price;

            portfolio_position.indicative = new_indicative;

            if (!proposal.is_valid_to_sell) {
                portfolio_position.status = 'no-resale';
            }
            else if (new_indicative !== prev_indicative) {
                portfolio_position.status = new_indicative > prev_indicative ? 'price-moved-up' : 'price-moved-down';
            }
            else {
                portfolio_position.status = '';
            }
        }
        this.data = data_source;
    }

    @action.bound
    updatePortfolio(response) {
        if (getPropertyValue(response, 'error')) {
            this.error = response.error.message;
            return;
        }
        if (response.portfolio.contracts && response.portfolio.contracts.length !== 0) {
            this.data = formatPortfolioData(response.portfolio.contracts);

            WS.subscribeProposalOpenContract(this.updateIndicative, false);
        }
    }

    @action.bound
    onMount() {
        this.initializePortfolio();
    }

    @action.bound
    onUnmount() {
        this.clearTable();
        WS.forgetAll('proposal_open_contract', 'transaction');
    }

    @computed
    get totals() {
        let indicative = 0;
        let payout     = 0;
        let purchase   = 0;

        this.data.forEach((portfolio_item) => {
            indicative += (+portfolio_item.indicative);
            payout     += (+portfolio_item.payout);
            purchase   += (+portfolio_item.purchase);
        });
        return {
            indicative,
            payout,
            purchase,
        };
    }

    @computed
    get has_no_open_positions() {
        return !this.is_loading && this.data.length === 0;
    }
}