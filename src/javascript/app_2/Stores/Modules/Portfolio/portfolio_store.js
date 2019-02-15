import {
    action,
    computed,
    observable }                   from 'mobx';
import { WS }                      from 'Services';
import { formatPortfolioPosition } from './Helpers/format_response';
import BaseStore                   from '../../base_store';

export default class PortfolioStore extends BaseStore {
    @observable data       = [];
    @observable is_loading = false;
    @observable error      = '';

    @action.bound
    initializePortfolio = () => {
        if (!this.root_store.client.is_logged_in) return;
        this.is_loading = true;

        WS.portfolio().then(this.portfolioHandler);
        WS.subscribeProposalOpenContract(null, this.proposalOpenContractHandler, false);
        WS.subscribeTransaction(this.transactionHandler, false);
    };

    @action.bound
    clearTable() {
        this.data       = [];
        this.is_loading = false;
        this.error      = '';
    }

    @action.bound
    portfolioHandler(response) {
        this.is_loading = false;
        if ('error' in response) {
            this.error = response.error.message;
            return;
        }
        this.error = '';
        if (response.portfolio.contracts) {
            this.data = response.portfolio.contracts
                .map(pos => formatPortfolioPosition(pos))
                .sort((pos1, pos2) => pos2.reference - pos1.reference); // new contracts first
        }
    }

    @action.bound
    transactionHandler(response) {
        if ('error' in response) {
            this.error = response.error.message;
        }
        if (!response.transaction) return;
        const { contract_id, action: act } = response.transaction;

        if (act === 'buy') {
            WS.portfolio().then((res) => {
                const new_pos = res.portfolio.contracts.find(pos => +pos.contract_id === +contract_id);
                if (!new_pos) return;
                this.pushNewPosition(new_pos);
            });
            // subscribe to new contract:
            WS.subscribeProposalOpenContract(contract_id, this.proposalOpenContractHandler, false);
        } else if (act === 'sell') {
            this.removePositionById(contract_id);
        }
    }

    @action.bound
    proposalOpenContractHandler(response) {
        if ('error' in response) return;

        const proposal = response.proposal_open_contract;
        const portfolio_position = this.data.find((position) => +position.id === +proposal.contract_id);

        if (!portfolio_position) return;

        const prev_indicative = portfolio_position.indicative;
        const new_indicative  = +proposal.bid_price;
        const profit_loss     = +proposal.profit;

        portfolio_position.indicative      = new_indicative;
        portfolio_position.underlying_code = proposal.underlying;
        portfolio_position.underlying_name = proposal.display_name;
        portfolio_position.profit_loss     = profit_loss;
        portfolio_position.purchase_time   = proposal.purchase_time;
        portfolio_position.tick_count      = proposal.tick_count;

        if (!proposal.is_valid_to_sell) {
            portfolio_position.status = 'no-resale';
        } else if (new_indicative > prev_indicative) {
            portfolio_position.status = 'price-moved-up';
        } else if (new_indicative < prev_indicative) {
            portfolio_position.status = 'price-moved-down';
        } else {
            portfolio_position.status = 'price-stable';
        }
    }

    @action.bound
    pushNewPosition(new_pos) {
        this.data.unshift(formatPortfolioPosition(new_pos));
    }

    @action.bound
    removePositionById(contract_id) {
        const i = this.data.findIndex(pos => +pos.id === +contract_id);
        this.data.splice(i, 1);
    }

    @action.bound
    accountSwitcherListener () {
        return new Promise((resolve) => {
            if (this.data.length === 0) {
                resolve(this.initializePortfolio());
            }
        });
    }

    @action.bound
    onMount() {
        this.onSwitchAccount(this.accountSwitcherListener);
        if (this.data.length === 0) {
            this.initializePortfolio();
        }
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        // keep data and connections for portfolio drawer on desktop
        if (this.root_store.ui.is_mobile) {
            this.clearTable();
            WS.forgetAll('proposal_open_contract', 'transaction');
        }
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
    get active_positions() {
        return this.data.filter((portfolio_pos) => {
            const server_epoch = this.root_store.common.server_time.unix();
            return portfolio_pos.expiry_time > server_epoch;
        });
    }

    @computed
    get is_empty() {
        return !this.is_loading && this.active_positions.length === 0;
    }
}
