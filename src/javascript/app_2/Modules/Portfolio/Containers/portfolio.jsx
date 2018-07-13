import React                     from 'react';
import CardList                  from '../Components/card_list.jsx';
import { formatPortfolioData }   from '../Helpers/process_data';
import DataTable                 from '../../../App/Components/Elements/data_table.jsx';
import NoticeMessage             from '../../../App/Components/Elements/notice_message.jsx';
import { contract_type_display } from '../../../Constants/contract';
import { WS }                    from '../../../Services';
import ClientBase                from '../../../../_common/base/client_base';
import { formatMoney }           from '../../../../_common/base/currency_base';
import { localize }              from '../../../../_common/localize';
import { getPropertyValue }      from '../../../../_common/utility';
import Loading                   from '../../../../../templates/_common/components/loading.jsx';
import { connect }                    from '../../../Stores/connect';
import { getTableColumnsTemplate }    from '../Constants/data_table_constants';

class Portfolio extends React.Component  {
    state = {
        currency   : ClientBase.get('currency').toLowerCase(),
        data_source: [],
        error      : null,
        footer     : {
            reference : 'Total',
            payout    : '',
            purchase  : '',
            indicative: '',
        },
        is_loading: true,
    };


    componentWillMount() {
        this.initializePortfolio();
    }

    componentWillUnmount() {     // eslint-disable-line class-methods-use-this
        WS.forgetAll('proposal_open_contract', 'transaction');
    }

    initializePortfolio = () => {
        WS.portfolio().then((response) => {
            this.setState({ is_loading: false });
            this.updatePortfolio(response);
        });
        WS.subscribeTransaction(this.transactionResponseHandler, false);
    };

    transactionResponseHandler = (response) => {
        if (getPropertyValue(response, 'error')) {
            this.setState({ error: response.error.message });
        }
        WS.portfolio().then((res) => this.updatePortfolio(res));
    };

    updateIndicative = (response) => {
        // prevent callback after component has unmounted
        if (!this.el) return;
        if (getPropertyValue(response, 'error')) {
            return;
        }
        let data_source = this.state.data_source.slice();
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
        const footer = this.updateFooterTotals(data_source);
        this.setState({ data_source, footer });
    };

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
            ...this.state.footer,
            indicative: formatMoney(false, indicative, true),
            payout    : formatMoney(false, payout, true),
            purchase  : formatMoney(false, purchase, true),
        };
    };

    updatePortfolio = (response) => {
        if (getPropertyValue(response, 'error')) {
            this.setState({ error: response.error.message });
            return;
        }
        if (response.portfolio.contracts && response.portfolio.contracts.length !== 0) {
            const data_source = formatPortfolioData(response.portfolio.contracts);
            const footer      = this.updateFooterTotals(data_source);

            this.setState({ data_source, footer });

            WS.subscribeProposalOpenContract(this.updateIndicative, false);
        }
    };

    render() {
        const {
            is_mobile,
        } = this.props;

        return (
            <div className='portfolio' ref={(el) => this.el = el}>
                {(() => {
                    const {error, is_loading} = this.state;

                    if (error) {
                        return <p>{error}</p>;
                    }
                    return (
                        <React.Fragment>
                            {
                                is_mobile ?
                                    <CardList data={this.state.data_source} currency={this.state.currency} />
                                    :
                                    <DataTable
                                        {...this.props}
                                        columns={getTableColumnsTemplate(this.state.currency)}
                                        data_source={this.state.data_source}
                                        footer={this.state.data_source.length > 0 ? this.state.footer : undefined}
                                        has_fixed_header
                                    />
                            }
                            {
                                is_loading &&
                                <Loading />
                            }
                            {!is_loading && this.state.data_source.length === 0 && <NoticeMessage>{localize('No open positions.')}</NoticeMessage>}
                        </React.Fragment>
                    );
                })()}
            </div>
        );
    }
}

export default connect(
    ({modules, ui}) => ({
        is_mobile              : ui.is_mobile,
    })
)(Portfolio);
