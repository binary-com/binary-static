import React from 'react';
import moment from 'moment';
import Client from '../../../app/base/client';
import BinarySocket from '../../../app/base/socket';
import { localize } from '../../../_common/localize';
import DataTable from '../../components/elements/data_table.jsx';

// return transformed array
const handlePortfolioData = (portfolio_data_arr) => {
    const formatted_data = portfolio_data_arr.map((portfolio_item) => {
        const date_obj       = new Date(portfolio_item.expiry_time* 1000);
        const moment_obj     = moment.utc(date_obj);
        const remaining_time = `${moment_obj.fromNow()} - ${moment_obj.format('h:mm:ss')}`;

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
                class : '',
            },
        };
    });
    console.log('formatted_data', formatted_data);
    return formatted_data;
};

class Portfolio extends React.PureComponent  {
    constructor(props) {
        super(props);

        this.getPortfolioData = this.getPortfolioData.bind(this);
        this.updateIndicative = this.updateIndicative.bind(this);

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
                    return <td key={data_index} className={data.class}> <span className={`symbols ${this.state.currency.toLowerCase()}`}/>{data.amount}</td>;
                },
            },
        ];
        const currency = Client.get('currency');
        this.state = {
            columns,
            currency,
            data_source    : [],
            has_no_contract: false,
        };
    }

    componentWillMount() {
        this.getPortfolioData();
    }

    componentWillUnmount() {
        console.log(this.state);
        BinarySocket.send({ forget_all: ['proposal_open_contract', 'transaction'] });
    }
    /* TODO:
        1. Move socket connections to DAO
        2. Handle errors
        3. Handle empty portfolio
        4. forget_all
    */
    getPortfolioData() {
        BinarySocket.send({ portfolio: 1 }).then((response) => {
            // Handle error
            if (response.portfolio.contracts && response.portfolio.contracts.length > 0) {
                const formatted_transactions = handlePortfolioData(response.portfolio.contracts);
                this.setState({
                    data_source: [...this.state.data_source, ...formatted_transactions],
                });
                BinarySocket.send(
                    { proposal_open_contract: 1, subscribe: 1 }, 
                    { callback: this.updateIndicative }
                );                
            } else {
            // empty portfolio
            }
        });
    }

    updateIndicative(data) {
        const amount       = parseFloat(data.proposal_open_contract.bid_price);
        const data_source  = this.state.data_source.slice();
        
        data_source.forEach(ds => {
            if (ds.ref === data.proposal_open_contract.transaction_ids.buy) {
                ds.indicative.class = data.proposal_open_contract.bid_price > ds.indicative.amount ? 'price_moved_up' : 'price_moved_down';
                ds.indicative.amount = amount;
            }
        });
        this.setState({ data_source });
    }

    render() {
        return (
            <DataTable
                {...this.props}
                data_source={this.state.data_source}
                columns={this.state.columns}                
            />
        );
    }
};

export default Portfolio;