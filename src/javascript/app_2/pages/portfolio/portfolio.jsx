import React from 'react';
import moment from 'moment';
import Client from '../../../app/base/client';
import BinarySocket from '../../../app/base/socket';
import { formatMoney } from '../../../app/common/currency';
import { localize } from '../../../_common/localize';
import DataTable from '../../components/elements/data_table.jsx';

// return transformed array
const handlePortfolioData = (portfolio_data_arr) => {
    const currency     = Client.get('currency');
    const formatted_data = portfolio_data_arr.map((portfolio_item) => {
        console.log(portfolio_item);
        const date_obj   = new Date(portfolio_item.expiry_time* 1000);
        const moment_obj = moment.utc(date_obj);
        const date_str   = moment_obj.format('YYYY-MM-DD');
        const time_str   = `${moment_obj.format('HH:mm:ss')} GMT`;
        const payout     = parseFloat(portfolio_item.payout);
        const amount     = parseFloat(portfolio_item.amount);
        const balance    = parseFloat(portfolio_item.balance_after);
        const buy_price  = parseFloat(portfolio_item.buy_price);
    
        return {
            ref     : portfolio_item.transaction_id,
            type    : portfolio_item.contract_type,
            asset   : portfolio_item.symbol,
            contract: localize(portfolio_item.longcode.replace(/\n/g, '<br />')),
            purchase: buy_price,
            payout  : isNaN(payout)  ? '-' : formatMoney(currency, payout),
            amount  : isNaN(amount)  ? '-' : formatMoney(currency, amount),
            balance : isNaN(balance) ? '-' : formatMoney(currency, balance),
            end_time: `${date_str}\n${time_str}`,
            id      : portfolio_item.contract_id,
            app_id  : portfolio_item.app_id,
        };
    });
    console.log('formatted_data', formatted_data);
    return formatted_data;
};

class Portfolio extends React.PureComponent  {
    constructor(props) {
        super(props);

        this.populatePortfolioData = this.populatePortfolioData.bind(this);

        const columns = [
            {
                title     : localize('Ref No'),
                data_index: 'ref',
            },
            {
                title     : localize('Trade Type'),
                data_index: 'type',
            },
            {
                title     : localize('Asset'),
                data_index: 'asset',
            },
            {
                title     : localize('Contract'),
                data_index: 'contract',
            },
            {
                title     : localize('Purchase'),
                data_index: 'purchase',
            },
            {
                title     : localize('Potential Payout'),
                data_index: 'payout',
            },
            // {
            //     title     : localize('Credit/Debit'),
            //     data_index: 'amount',
            //     renderCell: (data, data_index) => {
            //         const parseStrNum = (str) => parseFloat(str.replace(',', '.'));
            //         return <td className={`${data_index} ${(parseStrNum(data) >= 0) ? 'profit' : 'loss'}`} key={data_index}>{data}</td>;
            //     },
            // },
            {
                title     : localize('End Time'),
                data_index: 'end_time',
            },
        ];
        this.state = {
            columns,
            data_source    : [],
            has_no_contract: false,
        };
    }

    componentDidMount() {
        this.populatePortfolioData();
    }

    populatePortfolioData() {
        BinarySocket.send({ portfolio: 1 }).then((response) => {
            // if open contracts in portfolio
            console.log('portfolio: ', response);
            if (response.portfolio.contracts && response.portfolio.contracts.length > 0) {
                const formatted_transactions = handlePortfolioData(response.portfolio.contracts);
                this.setState({
                    data_source: [...this.state.data_source, ...formatted_transactions],
                });
            }
            // if empty portfolio
        });
        console.log('getPortfolioData', this.state);
    }
    
    // request "proposal_open_contract"
    //  BinarySocket.send({ proposal_open_contract: 1, subscribe: 1 }, { callback: updateIndicative });
    // updateIndicative()

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