import React from 'react';
import moment from 'moment';
import Client from '../../../app/base/client';
import DAO from '../../data/dao';
import { connect } from '../../store/connect';
import { toJapanTimeIfNeeded } from '../../../app/base/clock';
import { jpClient } from '../../../app/common/country_base';
import { formatMoney } from '../../../app/common/currency';
import { localize } from '../../../_common/localize';
import { toTitleCase } from '../../../_common/string_util';
import { throttlebounce } from '../../../_common/utility';
import DataTable from '../../components/elements/data_table.jsx';
import DatePicker from '../../components/form/date_picker.jsx';
import Loading from '../../../../templates/_common/components/loading.jsx';

/* TODO:
      1. to separate logic from UI
      3. to handle errors
      4. display loading, render table only after data is available
*/
const getStatementData = (statement, currency, is_jp_client) => {
    const date_obj   = new Date(statement.transaction_time * 1000);
    const moment_obj = moment.utc(date_obj);
    const date_str   = moment_obj.format('YYYY-MM-DD');
    const time_str   = `${moment_obj.format('HH:mm:ss')} GMT`;
    const payout     = parseFloat(statement.payout);
    const amount     = parseFloat(statement.amount);
    const balance    = parseFloat(statement.balance_after);

    return {
        action : localize(toTitleCase(statement.action_type)),
        date   : is_jp_client ? toJapanTimeIfNeeded(+statement.transaction_time) : `${date_str}\n${time_str}`,
        ref    : statement.transaction_id,
        payout : isNaN(payout)  ? '-' : formatMoney(currency, payout,  !is_jp_client),
        amount : isNaN(amount)  ? '-' : formatMoney(currency, amount,  !is_jp_client),
        balance: isNaN(balance) ? '-' : formatMoney(currency, balance, !is_jp_client),
        desc   : localize(statement.longcode.replace(/\n/g, '<br />')),
        id     : statement.contract_id,
        app_id : statement.app_id,
    };
};

class Statement extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.loadNextChunk = this.loadNextChunk.bind(this);
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
                title     : localize('Description'),
                data_index: 'desc',
            },
            {
                title     : localize('Action'),
                data_index: 'action',
            },
            {
                title     : localize('Potential Payout'),
                data_index: 'payout',
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
            data_source    : [],
            pending_request: false,
            has_loaded_all : false,
            chunks         : 1,
            date_from      : '',
            date_to        : '',
        };
    }

    componentDidMount() {
        window.moment = moment;
        this.getNextBatch();

        this._throttledHandleScroll = throttlebounce(this.handleScroll, 200);
        window.addEventListener('scroll', this._throttledHandleScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._throttledHandleScroll, false);
    }

    handleScroll() {
        const {scrollTop, scrollHeight, clientHeight} = document.scrollingElement;
        const left_to_scroll = scrollHeight - (scrollTop + clientHeight);

        if (left_to_scroll < 1000) {
            this.loadNextChunk();
        }
    }

    handleDateChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    loadNextChunk() {
        const { chunk_size } = this.props;
        const { chunks, data_source } = this.state;

        if (data_source.length <= chunks * chunk_size) {
            // all content is shown
            return;
        }

        this.setState({ chunks: chunks + 1 });

        if (data_source.length <= (chunks + 1) * chunk_size) {
            // last chunk has been loaded
            this.getNextBatch();
        }
    }

    getNextBatch() {
        if (this.state.has_loaded_all || this.state.pending_request) return;

        this.setState({ pending_request: true });

        const currency     = Client.get('currency');
        const is_jp_client = jpClient();

        DAO.getStatement(this.props.batch_size, this.state.data_source.length).then((response) => {
            const formatted_transactions = response.statement.transactions
                .map(transaction => getStatementData(transaction, currency, is_jp_client));

            this.setState({
                data_source    : [...this.state.data_source, ...formatted_transactions],
                has_loaded_all : formatted_transactions.length < this.props.batch_size,
                pending_request: false,
            });
        });
    }

    render() {
        if (this.state.data_source.length === 0) {
            return <Loading />;
        }

        const moment_now = moment(this.props.server_time);
        const today = moment_now.format('YYYY-MM-DD');

        return (
            <div className='statement-container'>
                <div className='statement-filter'>
                    <span className='statement-filter-text'>Filter by date:</span>
                    <span className='statement-filter-text'>from</span>
                    <DatePicker
                        name='date_from'
                        initial_value=''
                        startDate={moment_now.clone().subtract(30, 'd').format('YYYY-MM-DD')}
                        maxDate={this.state.date_to || today}
                        onChange={this.handleDateChange}
                    />
                    <span className='statement-filter-text'>to</span>
                    <DatePicker
                        name='date_to'
                        initial_value=''
                        startDate={today}
                        minDate={this.state.date_from}
                        maxDate={today}
                        showTodayBtn
                        onChange={this.handleDateChange}
                    />
                </div>
                <DataTable
                    data_source={this.state.data_source.slice(0, this.state.chunks * this.props.chunk_size)}
                    columns={this.state.columns}
                    has_fixed_header
                />
            </div>
        );
    }
}

Statement.defaultProps = {
    chunk_size: 50,  // display with chunks
    batch_size: 200, // request with batches
};

export default connect(
    ({trade}) => ({
        server_time: trade.server_time,
    })
)(Statement);
