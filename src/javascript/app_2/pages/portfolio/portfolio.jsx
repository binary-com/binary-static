import React from 'react';
import moment from 'moment';
import Client from '../../../app/base/client';
import BinarySocket from '../../../app/base/socket';
import { buildOauthApps } from '../../../app/common/get_app_details';
import { formatMoney } from '../../../app/common/currency';
import { localize } from '../../../_common/localize';
import { getPropertyValue } from '../../../_common/utility';
import DataTable from '../../components/elements/data_table.jsx';

const handlePortfolioData = (portfolio_arr) => {
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
    ASIANU      : {name: 'Asian Up', icon: 'asia_up'},
    ASIAND      : {name: 'Asian Down', icon: 'asia_down'},
    CALL        : {name: 'Higher', icon: 'higher'},
    CALLE       : {name: 'Higher or equal', icon: 'higher'},
    PUT         : {name: 'Lower', icon: 'lower'},
    DIGITMATCH  : {name: 'Digit Matches', icon: 'digit_matches'},
    DIGITDIFF   : {name: 'Digit Differs', icon: 'digit_differs'},
    DIGITODD    : {name: 'Digit Odd', icon: 'digit_odd'},
    DIGITEVEN   : {name: 'Digit Even', icon: 'digit_even'},
    DIGITOVER   : {name: 'Digit Over', icon: 'digit_over'},
    DIGITUNDER  : {name: 'Digit Under', icon: 'digit_under'},
    EXPIRYMISS  : {name: 'Ends Outside', icon: 'ends_outside'},
    EXPIRYRANGE : {name: 'Ends Between', icon: 'ends_between'},
    EXPIRYRANGEE: {name: 'Ends Between', icon: 'ends_between'},
    LBFLOATCALL : {name: 'Close-Low', icon: 'lower'},
    LBFLOATPUT  : {name: 'High-Close', icon: 'higher'},
    LBHIGHLOW   : {name: 'High-Low', icon: 'higher'},
    RANGE       : {name: 'Stays Between', icon: 'stays_between'},
    UPORDOWN    : {name: 'Goes Outside', icon: 'goes_outside'},
    ONETOUCH    : {name: 'Touches', icon: 'touch'},
    NOTOUCH     : {name: 'Does Not Touch', icon: 'no_touch'},
};

/* TODO:
    1. Move socket connections to DAO
    2. Make tooltip appdetails tooltip
    3. Add currencies to totals
    4. Add styling
    5. Translations
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
                renderCell: (data, data_index) => (
                    <td key={data_index}>
                        <div className={`${data_index}-container`}>
                            <i className={`trade_type_icon ${contract_type_display[data].icon}`} /> {contract_type_display[data].name}
                        </div>
                    </td>
                ),
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
                renderCell: (data, data_index) => (<td key={data_index}> <span className={`symbols ${this.state.currency.toLowerCase()}`}/>{data}</td>),
            },
            {
                title     : localize('Purchase'),
                data_index: 'purchase',
                renderCell: (data, data_index) => (<td key={data_index}> <span className={`symbols ${this.state.currency.toLowerCase()}`}/>{data}</td>),
            },
            {
                title     : localize('Indicative'),
                data_index: 'indicative',
                renderCell: (data, data_index) => (
                        data.amount ?
                            <td key={data_index} className={`indicative ${data.style}`}>
                                <span className={`symbols ${this.state.currency.toLowerCase()}`}/>{data.amount}
                                {data.style === 'no_resale' && <div> resell not offered</div>}
                            </td>
                            : <td key={data_index}>-</td>
                ),
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
        this.getPortfolioData();
    }

    componentWillUnmount() {
        console.log(this.state);
        BinarySocket.send({ forget_all: ['proposal_open_contract', 'transaction'] });
    }

    getPortfolioData = () => {
        BinarySocket.send({ portfolio: 1 }).then((response) => {
            this.updatePortfolio(response);
        });
        BinarySocket.send({ transaction: 1, subscribe: 1 }, { callback: this.transactionResponseHandler });
        BinarySocket.send({ oauth_apps: 1 }).then((response) => {
            this.updateOAuthApps(response);
        });
    }

    transactionResponseHandler = (response) => {
        if (getPropertyValue(response, 'error')) {
            this.setState({ error: response.error.message });
        }
        // Update portfolio for added / sold 
        BinarySocket.send({ portfolio: 1 }).then((res) => {
            this.updatePortfolio(res);
        });
    }

    updateIndicative = (response) => {
        if (getPropertyValue(response, 'error')) {
            return;
        }
        let data_source = this.state.data_source.slice();
        const footer    = Object.assign({}, this.state.footer);
        const proposal  = response.proposal_open_contract;
        // force to sell the expired contract, in order to remove from portfolio
        if (+proposal.is_settleable === 1 && !proposal.is_sold) {
            BinarySocket.send({ sell_expired: 1 });
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
        this.updateTotals(data_source, footer);
        this.setState({ data_source, footer });
    }
    
    updateTotals = (portfolioArr, footerObj) => {
        let indicative = 0; 
        let payout     = 0; 
        let purchase   = 0;
        
        portfolioArr.forEach((portfolio_item) => {
            indicative += (+portfolio_item.indicative.amount);
            payout     += (+portfolio_item.payout);
            purchase   += (+portfolio_item.purchase);
        });

        footerObj.indicative = formatMoney(false, indicative, true);
        footerObj.payout     = formatMoney(false, payout, true);
        footerObj.purchase   = formatMoney(false, purchase, true);
    } 

    updateOAuthApps = (response) => {
        const oauth_apps = buildOauthApps(response);
        console.log('oauth_apps: ', oauth_apps);
        // GetAppDetails.addTooltip(oauth_apps);
    };

    updatePortfolio = (response) => {
        this.setState({ is_loading: false });
        if (getPropertyValue(response, 'error')) {
            this.setState({ error: response.error.message });
            return;
        }
        if (response.portfolio.contracts && response.portfolio.contracts.length !== 0) {
            const data_source = handlePortfolioData(response.portfolio.contracts);
            const footer = Object.assign({}, this.state.footer);
            
            this.updateTotals(data_source, footer);
            this.setState({ data_source, footer });
            BinarySocket.send(
                { proposal_open_contract: 1, subscribe: 1 }, 
                { callback: this.updateIndicative }
            );                
        }
    }

    render() {
        return (
            <div>
                <div className='portfolio-header-container'><h2>Portfolio</h2></div>
                {(() => {
                    if (this.state.is_loading) {
                        return <div>Loading...</div>;
                    }
                    if (this.state.error) {
                        return <div>{this.state.error}</div>;
                    }
                    return (
                            this.state.data_source.length > 0 ?
                                <DataTable
                                    footer={this.state.footer}
                                    {...this.props}
                                    data_source={this.state.data_source}
                                    columns={this.state.columns}
                                />
                            : <div>No open positions.</div>
                    );
                })()}
            </div>
        );
    }
};

export default Portfolio;