import React from 'react';
import moment from 'moment';
import DAO from '../../data/dao';
import DataTable from '../../components/elements/data_table.jsx';
import Client from '../../../app/base/client';
import Loading from '../../../../templates/_common/components/loading.jsx';
import { buildOauthApps } from '../../../app/common/get_app_details';
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
    ASIANU      : {name: localize('Asian Up'), icon: 'asia_up'},
    ASIAND      : {name: localize('Asian Down'), icon: 'asia_down'},
    CALL        : {name: localize('Higher'), icon: 'higher'},
    CALLE       : {name: localize('Higher or equal'), icon: 'higher'},
    PUT         : {name: localize('Lower'), icon: 'lower'},
    DIGITMATCH  : {name: localize('Digit Matches'), icon: 'digit_matches'},
    DIGITDIFF   : {name: localize('Digit Differs'), icon: 'digit_differs'},
    DIGITODD    : {name: localize('Digit Odd'), icon: 'digit_odd'},
    DIGITEVEN   : {name: localize('Digit Even'), icon: 'digit_even'},
    DIGITOVER   : {name: localize('Digit Over'), icon: 'digit_over'},
    DIGITUNDER  : {name: localize('Digit Under'), icon: 'digit_under'},
    EXPIRYMISS  : {name: localize('Ends Outside'), icon: 'ends_outside'},
    EXPIRYRANGE : {name: localize('Ends Between'), icon: 'ends_between'},
    EXPIRYRANGEE: {name: localize('Ends Between'), icon: 'ends_between'},
    LBFLOATCALL : {name: localize('Close-Low'), icon: 'lower'},
    LBFLOATPUT  : {name: localize('High-Close'), icon: 'higher'},
    LBHIGHLOW   : {name: localize('High-Low'), icon: 'higher'},
    RANGE       : {name: localize('Stays Between'), icon: 'stays_between'},
    UPORDOWN    : {name: localize('Goes Outside'), icon: 'goes_outside'},
    ONETOUCH    : {name: localize('Touches'), icon: 'touch'},
    NOTOUCH     : {name: localize('Does Not Touch'), icon: 'no_touch'},
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
                                <div className={`${data_index}-container`}>
                                    <i className={`trade_type_icon ${contract_type_display[data].icon}`} /> 
                                    {contract_type_display[data].name}
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

    componentWillUnmount() {
        console.log(this.state);
        DAO.forgetAll('proposal_open_contract', 'transaction');
    }

    initializePortfolio = () => {
        DAO.getPortfolio().then((response) => {
            this.setState({ is_loading: false });
            this.updatePortfolio(response);
        });
        DAO.subscribeTransaction(1, this.transactionResponseHandler, false);
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
                    let amount = parseFloat(proposal.bid_price);
                    let style = portfolio_item.indicative.style;

                    amount = formatMoney(false, amount, true);

                    if (+proposal.is_valid_to_sell === 1) {
                        if (proposal.bid_price !== portfolio_item.indicative.amount) {
                            style = proposal.bid_price > portfolio_item.indicative.amount ? 'price_moved_up' : 'price_moved_down';
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

    updateOAuthApps = (response) => {
        const oauth_apps = buildOauthApps(response);
        console.log('oauth_apps: ', oauth_apps);
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

            DAO.subscribeProposalOpenContract(1, this.updateIndicative, false);
        }
    }

    render() {
        return (
            <div className='portfolio' ref={(el) => this.el = el}>
                <div className='portfolio-header-container'>
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