import React                     from 'react';
import PortfolioCard             from '../Components/portfolio_card.jsx';
import { formatPortfolioData }   from '../Helpers/process_data';
import DataTable                 from '../../../App/Components/Elements/data_table.jsx';
import Tooltip                   from '../../../App/Components/Elements/tooltip.jsx';
import { contract_type_display } from '../../../Constants/contract';
import { WS }                    from '../../../Services';
import { ProcessData }           from '../../../Services/Helpers';
import { getAppId }              from '../../../../config';
import ClientBase                from '../../../../_common/base/client_base';
import { formatMoney }           from '../../../../_common/base/currency_base';
import { localize }              from '../../../../_common/localize';
import { getPropertyValue }      from '../../../../_common/utility';
import Loading                   from '../../../../../templates/_common/components/loading.jsx';

const app_id = getAppId();

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
        oauth_apps: null,
    };

    columns = [
        {
            title     : localize('Reference No.'),
            data_index: 'reference',
            renderCell: (data, data_index) => {
                const { oauth_apps } = this.state;
                const tooltip = (data.app_id !== app_id) && oauth_apps && oauth_apps[data.app_id];
                if (tooltip) {
                    return (
                        <td key={data_index} className={data_index}>
                            <Tooltip
                                alignment='right'
                                message={localize('Transaction performed by [_1] (APP ID: [_2])', [tooltip, data.app_id])}
                            >
                                {data.transaction_id.toString()}
                            </Tooltip>
                        </td>);
                }
                return (
                    <td key={data_index} className={data_index}>
                        {data.transaction_id || ''}
                    </td>
                );
            },
        },
        {
            title     : localize('Contract Type'),
            data_index: 'type',
            renderCell: (data, data_index) => {
                if (data) {
                    return (
                        <td key={data_index}>
                            <div className={`${data_index}_container`}>
                                <i className={`trade_type_icon icon_${data.toLowerCase()}--light`} />
                                {localize(contract_type_display[data])}
                            </div>
                        </td>);
                }
                return ( <td key={data_index} />);
            },
        },
        {
            title     : localize('Contract Details'),
            data_index: 'details',
        },
        {
            title     : localize('Remaining Time (GMT)'),
            data_index: 'remaining_time',
        },
        {
            title     : localize('Potential Payout'),
            data_index: 'payout',
            renderCell: (data, data_index) => (<td key={data_index} className={data_index}> <span className={`symbols ${this.state.currency}`}/>{data}</td>),
        },
        {
            title     : localize('Purchase'),
            data_index: 'purchase',
            renderCell: (data, data_index) => (<td key={data_index} className={data_index}> <span className={`symbols ${this.state.currency}`}/>{data}</td>),
        },
        {
            title     : localize('Indicative'),
            data_index: 'indicative',
            renderCell: (data, data_index) => {
                if (data.amount) {
                    return (
                        <td key={data_index} className={`indicative ${data.style}`}>
                            <span className={`symbols ${this.state.currency}`}/>{data.amount}
                            {data.style === 'no_resale' && <div> {localize('resell not offered')}</div>}
                        </td>);
                }
                // Footer total:
                if (data && typeof data === 'string') {
                    return <td key={data_index} className={data_index}> <span className={`symbols ${this.state.currency}`}/>{data}</td>;
                }
                return <td key={data_index}>-</td>;
            },
        },
    ];

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
        WS.oauthApps().then((response) => this.updateOAuthApps(response));
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

    updateOAuthApps = (response) => {
        const oauth_apps = ProcessData.getOauthAppsObject(response);
        this.setState({ oauth_apps });
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
        return (
            <div className='portfolio' ref={(el) => this.el = el}>
                <div className='portfolio_header_container desktop-only'>
                    <h2>{localize('Portfolio')}</h2>
                </div>
                {(() => {
                    const {error, is_loading} = this.state;

                    if (is_loading) {
                        return <Loading />;
                    }
                    if (error) {
                        return <p>{error}</p>;
                    }
                    return (
                            this.state.data_source.length > 0 ?
                                <div>
                                    <div className='desktop-only'>
                                        <DataTable
                                            {...this.props}
                                            columns={this.columns}
                                            data_source={this.state.data_source}
                                            footer={this.state.footer}
                                            has_fixed_header
                                        />
                                    </div>
                                    <div className='mobile-only'>
                                        {this.state.data_source.map((transaction, idx) => (
                                            <div key={idx} className='card-list'>
                                                <PortfolioCard
                                                    {...transaction}
                                                    currency={this.state.currency}
                                                />
                                            </div>)
                                        )}
                                    </div>
                                </div>
                            : <p>{localize('No open positions.')}</p>
                    );
                })()}
            </div>
        );
    }
}

export default Portfolio;
