import classnames         from 'classnames';
import moment             from 'moment';
import PropTypes          from 'prop-types';
import React              from 'react';
import WS                 from '../../data/ws_methods';
import { connect }        from '../../store/connect';
import CardList           from '../../components/elements/card_list.jsx';
import DataTable          from '../../components/elements/data_table.jsx';
import DatePicker         from '../../components/form/date_picker.jsx';
import Client             from '../../../_common/base/client_base';
import { formatMoney }    from '../../../_common/base/currency_base';
import { localize }       from '../../../_common/localize';
import { toTitleCase }    from '../../../_common/string_util';
import Loading            from '../../../../templates/_common/components/loading.jsx';

/* TODO:
      1. to separate logic from UI
      3. to handle errors
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
        refid  : statement.transaction_id,
        payout : isNaN(payout)  ? '-' : formatMoney(currency, payout,  should_exclude_currency),
        amount : isNaN(amount)  ? '-' : formatMoney(currency, amount,  should_exclude_currency),
        balance: isNaN(balance) ? '-' : formatMoney(currency, balance, should_exclude_currency),
        desc   : localize(statement.longcode.replace(/\n/g, '<br />')),
        id     : statement.contract_id,
        app_id : statement.app_id,
    };
};

const StatementCard = ({ date, refid, desc, action, amount, payout, balance, className }) => (
    <div className={classnames('statement-card', className)}>
        <div className='statement-card__header'>
            <span className='statement-card__date'>{date}</span>
            <span className='statement-card__refid'>{refid}</span>
        </div>
        <div className='statement-card__body'>
            <div className='statement-card__desc'>{desc}</div>
            <div className='statement-card__row'>
                <div className={classnames('statement-card__cell statement-card__amount', {
                    'statement-card__amount--buy'       : action === 'Buy',
                    'statement-card__amount--sell'      : action === 'Sell',
                    'statement-card__amount--deposit'   : action === 'Deposit',
                    'statement-card__amount--withdrawal': action === 'Withdrawal',
                })}
                >
                    <span className='statement-card__cell-text'>
                        {amount}
                    </span>
                </div>
                <div className='statement-card__cell statement-card__payout'>
                    <span className='statement-card__cell-text'>
                        {payout}
                    </span>
                </div>
                <div className='statement-card__cell statement-card__balance'>
                    <span className='statement-card__cell-text'>
                        {balance}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

class Statement extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleScroll     = this.handleScroll.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.loadNextChunk    = this.loadNextChunk.bind(this);
        this.fetchNextBatch   = this.fetchNextBatch.bind(this);
        this.reloadTable      = this.reloadTable.bind(this);

        const columns = [
            {
                title     : localize('Date'),
                data_index: 'date',
            },
            {
                title     : localize('Ref.'),
                data_index: 'refid',
                // TODO: add data balloon later
                // renderCell: (data, data_index, transaction) => {
                //     return (
                //         <td key={data_index} className={data_index}>
                //             <span
                //                 data-balloon={transaction.app_id}
                //             >{data}</span>
                //         </td>
                //     );
                // },
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
                    return (
                        <td
                            key={data_index}
                            className={`${data_index} ${(parseStrNum(data) >= 0) ? 'profit' : 'loss'}`}
                        >
                            {data}
                        </td>
                    );
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
        // BinarySocket.send({ oauth_apps: 1 }).then((response) => {
        //     this.oauth_apps = buildOauthApps(response);
        //     console.log(this.oauth_apps);
        // });

        this.fetchNextBatch();

        window.addEventListener('scroll', this.handleScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll, false);
    }

    handleScroll() {
        const {scrollTop, scrollHeight, clientHeight} = document.scrollingElement;
        const left_to_scroll = scrollHeight - (scrollTop + clientHeight);

        if (left_to_scroll < 1000) {
            this.loadNextChunk();
        }
    }

    handleDateChange(e) {
        if (e.target.value !== this.state[e.target.name]) {
            this.reloadTable();
        }
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
            this.fetchNextBatch();
        }
    }

    fetchNextBatch() {
        if (this.state.has_loaded_all || this.state.pending_request) return;

        this.setState({ pending_request: true });

        const currency     = Client.get('currency');

        const { date_from, date_to } = this.state;

        WS.statement(
            this.props.batch_size,
            this.state.data_source.length,
            {
                ...date_from && {date_from: moment(date_from).unix()},
                ...date_to   && {date_to: moment(date_to).add(1, 'd').subtract(1, 's').unix()},
            }
        ).then((response) => {
            if (!this.el) return;

            const formatted_transactions = response.statement.transactions
                .map(transaction => getStatementData(transaction, currency));

            this.setState({
                data_source    : [...this.state.data_source, ...formatted_transactions],
                has_loaded_all : formatted_transactions.length < this.props.batch_size,
                pending_request: false,
            });
        });
    }

    reloadTable() {
        this.setState(
            {
                data_source    : [],
                has_loaded_all : false,
                pending_request: false,
                chunks         : 1,
            },
            this.fetchNextBatch
        );
    }

    renderNoActivityMessage() {
        return (
            <div className='container'>
                <div className='statement__no-activity-msg'>
                    {
                        !this.state.date_from && !this.state.date_to
                            ? localize('Your account has no trading activity.')
                            : localize('Your account has no trading activity for the selected period.')
                    }
                </div>
            </div>
        );
    }

    renderFilter(is_mobile) {
        const moment_now = moment(this.props.server_time);
        const today = moment_now.format('YYYY-MM-DD');
        const filter_class = classnames('statement-filter', {
            'mobile-only' : is_mobile,
            'desktop-only': !is_mobile,
        });

        return (
            <div className={filter_class}>
                <div className='statement-filter__content container'>
                    <span className='statement-filter__label'>{localize('Filter by date:')}</span>
                    <DatePicker
                        name='date_from'
                        initial_value=''
                        placeholder={localize('Start date')}
                        startDate={this.state.date_to || today}
                        maxDate={this.state.date_to || today}
                        onChange={this.handleDateChange}
                        is_nativepicker={is_mobile}
                    />
                    <span className='statement-filter__dash'>&mdash;</span>
                    <DatePicker
                        name='date_to'
                        initial_value=''
                        placeholder={localize('End date')}
                        startDate={today}
                        minDate={this.state.date_from}
                        maxDate={today}
                        showTodayBtn
                        onChange={this.handleDateChange}
                        is_nativepicker={is_mobile}
                    />
                </div>
            </div>
        );
    }

    render() {
        const is_loading = this.state.pending_request && this.state.data_source.length === 0;

        return (
            <div className='statement' ref={(el) => this.el = el}>

                {this.renderFilter(false)}
                {this.renderFilter(true)}

                <div className='statement__content'>
                    <div className='desktop-only'>
                        <DataTable
                            data_source={this.state.data_source.slice(
                                0,
                                this.state.chunks * this.props.chunk_size
                            )}
                            columns={this.state.columns}
                            has_fixed_header
                            is_full_width
                        />
                    </div>
                    <div className='mobile-only'>
                        <CardList
                            data_source={this.state.data_source.slice(
                                0,
                                this.state.chunks * this.props.chunk_size
                            )}
                            Card={StatementCard}
                        />
                    </div>
                    {is_loading && <Loading />
                        || this.state.data_source.length === 0 && this.renderNoActivityMessage()}
                </div>
            </div>
        );
    }
}

Statement.defaultProps = {
    batch_size: 200, // request with batches
    chunk_size: 50,  // display with chunks
};

StatementCard.propTypes = {
    action   : PropTypes.string,
    amount   : PropTypes.string,
    balance  : PropTypes.string,
    className: PropTypes.string,
    date     : PropTypes.string,
    desc     : PropTypes.string,
    payout   : PropTypes.string,
    refid    : PropTypes.string,
};

Statement.propTypes = {
    batch_size : PropTypes.number,
    chunk_size : PropTypes.number,
    server_time: PropTypes.object,
};

export default connect(
    ({ common }) => ({
        server_time: common.server_time,
    })
)(Statement);
