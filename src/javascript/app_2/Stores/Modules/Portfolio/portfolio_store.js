import {
    action,
    computed,
    observable }                 from 'mobx';
import { formatPortfolioData }   from './Helpers/process_data';
import BaseStore                 from '../../base_store';
import { WS }                    from '../../../Services';
import { formatMoney }           from '../../../../_common/base/currency_base';
import { getPropertyValue }      from '../../../../_common/utility';

export default class StatementStore extends BaseStore {
    @observable data       = [];
    @observable is_loading = false;
    @observable error      = '';
    @observable footer     = {
        reference : 'Total',
        payout    : '',
        purchase  : '',
        indicative: '',
    };

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
    transactionResponseHandler = (response) => {
        if (getPropertyValue(response, 'error')) {
            this.error = response.error.message;
        }
        WS.portfolio().then((res) => this.updatePortfolio(res));
    };

    @action.bound
    updateIndicative(response) {
        // prevent callback after component has unmounted
        if (!this.el) return;
        if (getPropertyValue(response, 'error')) {
            return;
        }
        let data_source = this.data.slice();
        const proposal  = response.proposal_open_contract;
        // force to sell the expired contract, in order to remove from portfolio
        if (+proposal.is_settleable === 1 && !proposal.is_sold) {
            WS.sellExpired();
        }
        if (+proposal.is_sold === 1) {
            data_source = data_source.filter((portfolio_item) => portfolio_item.id !== +proposal.contract_id);
        } else {
            data_source.forEach(portfolio_item => {
                if (portfolio_item.id === +proposal.contract_id) {
                    const indicative = portfolio_item.indicative.amount || '0.00';
                    const amount = formatMoney(false, proposal.bid_price, true);
                    let style = portfolio_item.indicative.style;

                    if (+proposal.is_valid_to_sell === 1) {
                        if (amount !== indicative) {
                            style = amount > indicative ? 'price_moved_up' : 'price_moved_down';
                        }
                    } else {
                        style = 'no_resale';
                    }
                    portfolio_item.indicative = { style, amount };
                }
            });
        }
        this.data = data_source;
        this.footer = this.updateFooterTotals(data_source);
    }

    updateFooterTotals = (portfolioArr) => {
        let indicative = 0;
        let payout     = 0;
        let purchase   = 0;

        portfolioArr.forEach((portfolio_item) => {
            indicative += (+portfolio_item.indicative.amount);
            payout     += (+portfolio_item.payout);
            purchase   += (+portfolio_item.purchase);
        });
        return {
            ...this.footer,
            indicative: formatMoney(false, indicative, true),
            payout    : formatMoney(false, payout, true),
            purchase  : formatMoney(false, purchase, true),
        };
    };

    @action.bound
    updatePortfolio(response) {
        if (getPropertyValue(response, 'error')) {
            this.error = response.error.message;
            return;
        }
        if (response.portfolio.contracts && response.portfolio.contracts.length !== 0) {
            this.data = formatPortfolioData(response.portfolio.contracts);
            this.footer = this.updateFooterTotals(this.data);

            WS.subscribeProposalOpenContract(this.updateIndicative, false);
        }
    }

    @action.bound
    onMount() {
        this.initializePortfolio();
    }

    @action.bound
    onUnmount() {
        WS.forgetAll('proposal_open_contract', 'transaction');
    }
}