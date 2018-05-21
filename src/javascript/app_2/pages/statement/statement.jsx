import moment          from 'moment';
import React           from 'react';
import DataTable       from '../../components/elements/data_table.jsx';
import Client          from '../../../_common/base/client_base';
import { formatMoney } from '../../../_common/base/currency_base';
import BinarySocket    from '../../../_common/base/socket_base';
import { localize }    from '../../../_common/localize';
import { toTitleCase } from '../../../_common/string_util';

/* TODO:
      1. to separate logic from UI
      2. to move socket calls to DAO
      3. to handle errors
      4. display loading, render table only after data is available
*/
const getStatementData = (statement, currency) => {
    const date_obj   = new Date(statement.transaction_time * 1000);
    const moment_obj = moment.utc(date_obj);
    const date_str   = moment_obj.format('YYYY-MM-DD');
    const time_str   = `${moment_obj.format('HH:mm:ss')} GMT`;
    const payout     = parseFloat(statement.payout);
    const amount     = parseFloat(statement.amount);
    const balance    = parseFloat(statement.balance_after);
    const should_exclude_currency = true;

    return {
        action : localize(toTitleCase(statement.action_type)),
        date   : `${date_str}\n${time_str}`,
        ref    : statement.transaction_id,
        payout : isNaN(payout)  ? '-' : formatMoney(currency, payout,  should_exclude_currency),
        amount : isNaN(amount)  ? '-' : formatMoney(currency, amount,  should_exclude_currency),
        balance: isNaN(balance) ? '-' : formatMoney(currency, balance, should_exclude_currency),
        desc   : localize(statement.longcode.replace(/\n/g, '<br />')),
        id     : statement.contract_id,
        app_id : statement.app_id,
    };
};

class Statement extends React.PureComponent {
    constructor(props) {
        super(props);

        this.getNextBatch = this.getNextBatch.bind(this);

        const columns = [
            {
                title     : localize('Date'),
                data_index: 'date',
            },
            {
                title     : localize('Ref.'),
                data_index: 'ref',
            },
            {
                title     : localize('Potential Payout'),
                data_index: 'payout',
            },
            {
                title     : localize('Action'),
                data_index: 'action',
            },
            {
                title     : localize('Description'),
                data_index: 'desc',
            },
            {
                title     : localize('Credit/Debit'),
                data_index: 'amount',
                renderCell: (data, data_index) => {
                    const parseStrNum = (str) => parseFloat(str.replace(',', '.'));
                    return <td className={`${data_index} ${(parseStrNum(data) >= 0) ? 'profit' : 'loss'}`} key={data_index}>{data}</td>;
                },
            },
            {
                title     : localize('Balance'),
                data_index: 'balance',
            },
        ];

        this.state = {
            columns,
            data_source  : [],
            is_loaded_all: false,
        };
    }

    componentDidMount() {
        // BinarySocket.send({ oauth_apps: 1 }).then((response) => {
        //     console.log('oauth response', response);
        // });
        this.getNextBatch();
    }

    getNextBatch() {
        if (this.state.is_loaded_all) return;

        const BATCH_SIZE = 200;
        const req = {
            statement  : 1,
            description: 1,
            limit      : BATCH_SIZE,
            offset     : this.state.data_source.length,
        };

        const currency     = Client.get('currency');

        BinarySocket.send(req).then((response) => {
            const formatted_transactions = response.statement.transactions
                .map(transaction => getStatementData(transaction, currency));

            this.setState({
                data_source  : [...this.state.data_source, ...formatted_transactions],
                is_loaded_all: formatted_transactions.length < BATCH_SIZE,
            });
        });
    }

    render() {
        return (
            <DataTable
                {...this.props}
                data_source={this.state.data_source}
                columns={this.state.columns}
                onCloseToEnd={this.getNextBatch}
            />
        );
    }
}

export default Statement;
