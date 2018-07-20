import {
    action,
    computed,
    observable }                 from 'mobx';
import { formatPortfolioData }   from './Helpers/process_data';
import BaseStore                 from '../../base_store';
import { WS }                    from '../../../Services';

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
        WS.subscribeTransaction(this.transactionHandler, false);
    };

    @action.bound
    clearTable() {
        this.data       = [];
        this.is_loading = false;
        this.error      = '';
    }

    @action.bound
    transactionHandler(response) {
        if ('error' in response) {
            this.error = response.error.message;
        }
        WS.portfolio().then((res) => this.updatePortfolio(res));
    };

    @action.bound
    proposalOpenContractHandler(response) {
        if ('error' in response) {
            return;
        }
        const proposal = response.proposal_open_contract;

        // force to sell the expired contract, in order to remove from portfolio
        if (+proposal.is_settleable === 1 && !proposal.is_sold) { WS.sellExpired(); }

        const position_data_index = this.data.findIndex(
            (position) => position.id === +proposal.contract_id
        );

        if (proposal.is_sold) {
            this.data.splice(position_data_index, 1);
        } else {
            const portfolio_position = this.data[position_data_index];

            const prev_indicative = portfolio_position.indicative;
            const new_indicative  = proposal.bid_price;

            portfolio_position.indicative = new_indicative;

            if (!proposal.is_valid_to_sell) {
                portfolio_position.status = 'no-resale';
            }
            else if (new_indicative > prev_indicative) {
                portfolio_position.status = 'price-moved-up';
            }
            else if (new_indicative < prev_indicative) {
                portfolio_position.status = 'price-moved-down';
            }
            else {
                portfolio_position.status = 'price-stable';
            }
        }
    }

    @action.bound
    updatePortfolio(response) {
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }
        if (response.portfolio.contracts && response.portfolio.contracts.length !== 0) {
            this.data = formatPortfolioData(response.portfolio.contracts);

            WS.subscribeProposalOpenContract(this.proposalOpenContractHandler, false);
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
    get is_empty() {
        return !this.is_loading && this.data.length === 0;
    }
}