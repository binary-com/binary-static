import React from 'react';
import moment from 'moment';
import DAO from '../../data/dao';
import DataTable from '../../components/elements/data_table.jsx';
import Client from '../../../app/base/client';
import Loading from '../../../../templates/_common/components/loading.jsx';
import { buildOauthApps } from '../../../app/common/get_app_details'; // eslint-disable-line
import { formatMoney } from '../../../app/common/currency';
import { localize } from '../../../_common/localize';
import { getPropertyValue } from '../../../_common/utility';

const formatPortfolioData = (portfolio_arr) => {
    const formatted_portfolio = portfolio_arr.map((portfolio_item) => {
        const date_obj        = new Date(portfolio_item.expiry_time* 1000);
        const moment_obj      = moment.utc(date_obj);
        const remaining_time  = `${moment_obj.fromNow()} - ${moment_obj.format('h:mm:ss')}`;
        const purchase        = parseFloat(portfolio_item.buy_price);
        const payout          = parseFloat(portfolio_item.payout);

        return {
            ref       : portfolio_item.transaction_id,
            type      : portfolio_item.contract_type,
            details   : localize(portfolio_item.longcode.replace(/\n/g, '<br />')),
            purchase  : formatMoney(false, purchase, true),
            payout    : formatMoney(false, payout, true),
            remaining_time,
            id        : portfolio_item.contract_id,
            app_id    : portfolio_item.app_id,
            indicative: {
                amount: '',
                style : '',
            },
        };
    });
    return formatted_portfolio;
};

// TODO: move to common
const contract_type_display = {
    ASIANU      : localize('Asian Up'),
    ASIAND      : localize('Asian Down'),
    CALL        : localize('Higher'),
    CALLE       : localize('Higher or equal'),
    PUT         : localize('Lower'),
    DIGITMATCH  : localize('Digit Matches'),
    DIGITDIFF   : localize('Digit Differs'),
    DIGITODD    : localize('Digit Odd'),
    DIGITEVEN   : localize('Digit Even'),
    DIGITOVER   : localize('Digit Over'),
    DIGITUNDER  : localize('Digit Under'),
    EXPIRYMISS  : localize('Ends Outside'),
    EXPIRYRANGE : localize('Ends Between'),
    EXPIRYRANGEE: localize('Ends Between'),
    LBFLOATCALL : localize('Close-Low'),
    LBFLOATPUT  : localize('High-Close'),
    LBHIGHLOW   : localize('High-Low'),
    RANGE       : localize('Stays Between'),
    UPORDOWN    : localize('Goes Outside'),
    ONETOUCH    : localize('Touches'),
    NOTOUCH     : localize('Does Not Touch'),
};

/* TODO:
    1. Make tooltip appdetails tooltip
*/
class Portfolio extends React.PureComponent  {
    constructor(props) {
        super(props);

        const columns = [
            {
                title     : localize('Reference No.'),
                data_index: 'ref',
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
                                    {contract_type_display[data]}
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
                renderCell: (data, data_index) => (<td key={data_index} className={data_index}> <span className={`symbols ${this.state.currency.toLowerCase()}`}/>{data}</td>),
            },
            {
                title     : localize('Purchase'),
                data_index: 'purchase',
                renderCell: (data, data_index) => (<td key={data_index} className={data_index}> <span className={`symbols ${this.state.currency.toLowerCase()}`}/>{data}</td>),
            },
            {
                title     : localize('Indicative'),
                data_index: 'indicative',
                renderCell: (data, data_index) => {
                    if (data.amount) {
                        return (
                            <td key={data_index} className={`indicative ${data.style}`}>
                                <span className={`symbols ${this.state.currency.toLowerCase()}`}/>{data.amount}
                                {data.style === 'no_resale' && <div> {localize('resell not offered')}</div>}
                            </td>);
                    }
                    // Footer total:
                    if (data && typeof data === 'string') {
                        return <td key={data_index} className={data_index}> <span className={`symbols ${this.state.currency.toLowerCase()}`}/>{data}</td>;
                    }
                    return <td key={data_index}>-</td>;
                },
            },
        ];
        const footer = {
            ref       : 'Total',
            payout    : '',
            purchase  : '',
            indicative: '',
        };
        const currency = Client.get('currency');
        this.state = {
            columns,
            currency,
            data_source: [],
            error      : '',
            footer, 
            is_loading : true,
        };
    }

    componentWillMount() {
        this.initializePortfolio();
    }

    componentWillUnmount() {     // eslint-disable-line class-methods-use-this
        DAO.forgetAll('proposal_open_contract', 'transaction');
    }

    initializePortfolio = () => {
        DAO.getPortfolio().then((response) => {
            this.setState({ is_loading: false });
            this.updatePortfolio(response);
        });
        DAO.subscribeTransaction(this.transactionResponseHandler, false);
        DAO.getOauthApps().then((response) => this.updateOAuthApps(response));
    }

    transactionResponseHandler = (response) => {
        if (getPropertyValue(response, 'error')) {
            this.setState({ error: response.error.message });
        }
        // Update portfolio for added / sold 
        DAO.getPortfolio().then((res) => this.updatePortfolio(res));
    }

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
            DAO.sellExpired();
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
            ...this.state.footer,
            indicative: formatMoney(false, indicative, true),
            payout    : formatMoney(false, payout, true),
            purchase  : formatMoney(false, purchase, true),
        };
    } 

    updateOAuthApps = (response) => { // eslint-disable-line
        // const oauth_apps = buildOauthApps(response);
        // GetAppDetails.addTooltip(oauth_apps);
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

            DAO.subscribeProposalOpenContract(this.updateIndicative, false);
        }
    }

    render() {
        return (
            <div className='portfolio' ref={(el) => this.el = el}>
                <div className='portfolio_header_container'>
                    <h2>{localize('Portfolio')}</h2>
                </div>
                {(() => {
                    if (this.state.is_loading) {
                        return <Loading />;
                    }
                    if (this.state.error) {
                        return <div>{this.state.error}</div>;
                    }
                    return (
                            this.state.data_source.length > 0 ?
                                <DataTable
                                    {...this.props}
                                    columns={this.state.columns}
                                    data_source={this.state.data_source}
                                    footer={this.state.footer}
                                />
                            : <div><p>{localize('No open positions.')}</p></div>
                    );
                })()}
            </div>
        );
    }
};

export default Portfolio;
