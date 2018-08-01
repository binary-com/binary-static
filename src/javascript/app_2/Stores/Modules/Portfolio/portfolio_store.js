import {
    action,
    computed,
    observable }                   from 'mobx';
import { formatPortfolioResponse } from './Helpers/format_response';
import BaseStore                   from '../../base_store';
import { WS }                      from '../../../Services';
import {
    getDiffDuration,
    formatDuration }               from '../../../Utils/Date';

export default class PortfolioStore extends BaseStore {
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
        WS.subscribeProposalOpenContract(this.proposalOpenContractHandler, false);
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
        // subscribe to new contracts:
        WS.subscribeProposalOpenContract(this.proposalOpenContractHandler, false);
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

        if (position_data_index === -1) return;

        if (proposal.is_sold) {
            this.data.splice(position_data_index, 1);
        } else {
            const portfolio_position = this.data[position_data_index];

            const prev_indicative = portfolio_position.indicative;
            const new_indicative  = +proposal.bid_price;

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
            this.data = formatPortfolioResponse(response.portfolio.contracts);
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
    get data_with_remaining_time() {
        // don't use es6 spread operator here
        // modifying object in place is 20 times faster (http://jsben.ch/YTUEK)
        // this function runs every second
        return this.data.map((portfolio_pos) => {
            portfolio_pos.remaining_time = formatDuration(
                getDiffDuration(this.root_store.common.server_time.unix(), portfolio_pos.expiry_time)
            );
            return portfolio_pos;
        });
    }

    @computed
    get totals() {
        let indicative = 0;
        let payout     = 0;
        let purchase   = 0;

        this.data.forEach((portfolio_pos) => {
            indicative += (+portfolio_pos.indicative);
            payout     += (+portfolio_pos.payout);
            purchase   += (+portfolio_pos.purchase);
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
