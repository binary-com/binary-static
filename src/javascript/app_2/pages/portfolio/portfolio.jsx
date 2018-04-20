import React from 'react';
import moment from 'moment';
import Client from '../../../app/base/client';
import BinarySocket from '../../../app/base/socket';
import { buildOauthApps } from '../../../app/common/get_app_details';
import { localize } from '../../../_common/localize';
import { getPropertyValue } from '../../../_common/utility';
import DataTable from '../../components/elements/data_table.jsx';

// return transformed array
const handlePortfolioData = (portfolio_arr) => {
    const formatted_portfolio = portfolio_arr.map((portfolio_item) => {
        const date_obj        = new Date(portfolio_item.expiry_time* 1000);
        const moment_obj      = moment.utc(date_obj);
        const remaining_time  = `${moment_obj.fromNow()} - ${moment_obj.format('h:mm:ss')}`;

        return {
            ref       : portfolio_item.transaction_id,
            type      : portfolio_item.contract_type,
            asset     : portfolio_item.symbol,
            details   : localize(portfolio_item.longcode.replace(/\n/g, '<br />')),
            purchase  : parseFloat(portfolio_item.buy_price),
            payout    : parseFloat(portfolio_item.payout),
            remaining_time,
            id        : portfolio_item.contract_id,
            app_id    : portfolio_item.app_id,
            indicative: {
                amount: parseFloat(portfolio_item.amount),
                style : '',
            },
        };
    });
    return formatted_portfolio;
};
/* TODO:
    1. Move socket connections to DAO
    2. Selling both in transactionHandler and updateIndicative?
    3. Make tooltip appdetails tooltip
    4. Add styling
    5. Translations
*/
class Portfolio extends React.PureComponent  {
    constructor(props) {
        super(props);

        this.getPortfolioData = this.getPortfolioData.bind(this);
        this.transactionResponseHandler = this.transactionResponseHandler.bind(this);
        this.updateIndicative = this.updateIndicative.bind(this);
        this.updateOAuthApps = this.updateOAuthApps.bind(this);
        this.updatePortfolio = this.updatePortfolio.bind(this);

        const columns = [
            {
                title     : localize('Ref No'),
                data_index: 'ref',
            },
            {
                title     : localize('Contract Type'),
                data_index: 'type',
            },
            {
                title     : localize('Asset'),
                data_index: 'asset',
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
                renderCell: (data, data_index) => {
                    const is_nan = isNaN(data.amount);
                    if (is_nan) {
                        return <td key={data_index}>-</td>;
                    }
                    return (
                        <td key={data_index} className={data.style}> 
                            <span className={`symbols ${this.state.currency.toLowerCase()}`}/>{data.amount}
                            {data.style === 'no_resale' && <div> resell not offered</div>}
                        </td>);
                },
            },
        ];
        const currency = Client.get('currency');
        this.state = {
            columns,
            currency,
            data_source: [],
            error      : '', 
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

    getPortfolioData() {
        BinarySocket.send({ portfolio: 1 }).then((response) => {
            this.updatePortfolio(response);
        });
        BinarySocket.send({ transaction: 1, subscribe: 1 }, { callback: this.transactionResponseHandler });
        BinarySocket.send({ oauth_apps: 1 }).then((response) => {
            this.updateOAuthApps(response);
        });
    }

    transactionResponseHandler(response) {
        if (getPropertyValue(response, 'error')) {
            this.setState({ error: response.error.message });
        }
        if (response.transaction.action === 'buy') {
            BinarySocket.send({ portfolio: 1 }).then((res) => {
                this.updatePortfolio(res);
            });
        } else if (response.transaction.action === 'sell') {
             // removeContract(response.transaction.contract_id);
        }
    }

    updateIndicative(response) {
        if (getPropertyValue(response, 'error')) {
            return;
        }
        let data_source = this.state.data_source.slice();
        const proposal    = response.proposal_open_contract;
        // force to sell the expired contract, in order to remove from portfolio
        if (+proposal.is_settleable === 1 && !proposal.is_sold) {
            BinarySocket.send({ sell_expired: 1 });
        }
        if (+proposal.is_sold === 1) {
            data_source = data_source.filter((portfolio_item) => portfolio_item.id !== +proposal.contract_id);
        } else {
            data_source.forEach(portfolio_item => {
                if (portfolio_item.id === +proposal.contract_id) {
                    const amount = parseFloat(proposal.bid_price);
                    let style;
                    if (+proposal.is_valid_to_sell === 1) {
                        style = proposal.bid_price > portfolio_item.indicative.amount ? 'price_moved_up' : 'price_moved_down';
                    } else {
                        style = 'no_resale';
                    }
                    portfolio_item.indicative = { style, amount };
                }
            });
        }
        this.setState({ data_source });
    }

    updateOAuthApps = (response) => {
        const oauth_apps = buildOauthApps(response);
        console.log('oauth_apps: ', oauth_apps);
        // GetAppDetails.addTooltip(oauth_apps);
    };

    updatePortfolio(response) {
        this.setState({ is_loading: false });
        if (getPropertyValue(response, 'error')) {
            this.setState({ error: response.error.message });
            return;
        }
        if (response.portfolio.contracts && response.portfolio.contracts.length !== 0) {
            const data_source = handlePortfolioData(response.portfolio.contracts);
            
            this.setState({ data_source });
            BinarySocket.send(
                { proposal_open_contract: 1, subscribe: 1 }, 
                { callback: this.updateIndicative }
            );                
        }
    }

    render() {
        if (this.state.is_loading) {
            return <div>Loading...</div>;
        }
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        }
        return (
                this.state.data_source.length > 0 ? 
                    <DataTable
                        {...this.props}
                        data_source={this.state.data_source}
                        columns={this.state.columns}                
                    />
                : <div>No open positions.</div>
        );
    }
};

export default Portfolio;