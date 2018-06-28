import React              from 'react';
import classnames         from 'classnames';
import moment             from 'moment';
import PropTypes          from 'prop-types';
import CardList           from '../../components/elements/card_list.jsx';
import DataTable          from '../../components/elements/data_table.jsx';
import DatePicker         from '../../components/form/date_picker.jsx';
import { connect }        from '../../store/connect';
import { localize }       from '../../../_common/localize';
import Loading            from '../../../../templates/_common/components/loading.jsx';

/* TODO:
    - handle errors
*/
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

const columns = [
    {
        title     : localize('Date'),
        data_index: 'date',
    },
    {
        title     : localize('Ref.'),
        data_index: 'refid',
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

class Statement extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        this.props.fetchNextBatch();
        window.addEventListener('scroll', this.handleScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll, false);
    }

    handleScroll() {
        const {scrollTop, scrollHeight, clientHeight} = document.scrollingElement;
        const left_to_scroll = scrollHeight - (scrollTop + clientHeight);

        if (left_to_scroll < 2000) {
            this.props.fetchNextBatch();
        }
    }

    renderNoActivityMessage() {
        return (
            <div className='container'>
                <div className='statement__no-activity-msg'>
                    {
                        !this.props.date_from && !this.props.date_to
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
                        startDate={this.props.date_to || today}
                        maxDate={this.props.date_to || today}
                        onChange={this.props.handleDateChange}
                        is_nativepicker={is_mobile}
                    />
                    <span className='statement-filter__dash'>&mdash;</span>
                    <DatePicker
                        name='date_to'
                        initial_value=''
                        placeholder={localize('End date')}
                        startDate={today}
                        minDate={this.props.date_from}
                        maxDate={today}
                        showTodayBtn
                        onChange={this.props.handleDateChange}
                        is_nativepicker={is_mobile}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className='statement'>

                {this.renderFilter(false)}
                {this.renderFilter(true)}

                <div className='statement__content'>
                    <div className='desktop-only'>
                        <DataTable
                            data_source={this.props.data}
                            columns={columns}
                            has_fixed_header
                            is_full_width
                        />
                    </div>
                    <div className='mobile-only'>
                        <CardList
                            data_source={this.props.data}
                            Card={StatementCard}
                        />
                    </div>
                    {this.props.is_loading && <Loading />}
                    {!this.props.is_loading && this.props.data.length === 0 && this.renderNoActivityMessage()}
                </div>
            </div>
        );
    }
}

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
    data            : PropTypes.object,
    date_from       : PropTypes.string,
    date_to         : PropTypes.string,
    fetchNextBatch  : PropTypes.func,
    handleDateChange: PropTypes.func,
    is_loading      : PropTypes.bool,
    server_time     : PropTypes.string,
};

export default connect(
    ({ common, pages }) => ({
        server_time     : common.server_time,
        data            : pages.statement.data,
        is_loading      : pages.statement.is_loading,
        has_loaded_all  : pages.statement.has_loaded_all,
        date_from       : pages.statement.date_from,
        date_to         : pages.statement.date_to,
        fetchNextBatch  : pages.statement.fetchNextBatch,
        handleDateChange: pages.statement.handleDateChange,
    })
)(Statement);
