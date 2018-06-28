import React              from 'react';
import classnames         from 'classnames';
import moment             from 'moment';
import PropTypes          from 'prop-types';
import StatementCard      from './components/statement_card.jsx';
import CardList           from '../../components/elements/card_list.jsx';
import DataTable          from '../../components/elements/data_table.jsx';
import DatePicker         from '../../components/form/date_picker.jsx';
import { connect }        from '../../store/connect';
import { localize }       from '../../../_common/localize';
import Loading            from '../../../../templates/_common/components/loading.jsx';

const renderAmountCell = (data, data_index) => {
    const parseStrNum = (str) => parseFloat(str.replace(',', '.'));
    return (
        <td
            key={data_index}
            className={`${data_index} ${(parseStrNum(data) >= 0) ? 'profit' : 'loss'}`}
        >
            {data}
        </td>
    );
};

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
        renderCell: renderAmountCell,
    },
    {
        title     : localize('Balance'),
        data_index: 'balance',
    },
];

class Statement extends React.PureComponent {
    componentDidMount() {
        this.props.fetchNextBatch();
        window.addEventListener('scroll', this.handleScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll, false);
        this.props.clearTable();
    }

    handleScroll = () => {
        const {scrollTop, scrollHeight, clientHeight} = document.scrollingElement;
        const left_to_scroll = scrollHeight - (scrollTop + clientHeight);

        if (left_to_scroll < 2000) {
            this.props.fetchNextBatch();
        }
    }

    renderNoActivityMessage() {
        const { date_from, date_to } = this.props;
        return (
            <div className='container'>
                <div className='statement__no-activity-msg'>
                    {
                        !date_from && !date_to
                            ? localize('Your account has no trading activity.')
                            : localize('Your account has no trading activity for the selected period.')
                    }
                </div>
            </div>
        );
    }

    renderFilter(is_mobile) {
        const today = moment(this.props.server_time).format('YYYY-MM-DD');
        const filter_class = classnames('statement-filter', {
            'mobile-only' : is_mobile,
            'desktop-only': !is_mobile,
        });
        const { date_to, date_from, handleDateChange } = this.props;
        return (
            <div className={filter_class}>
                <div className='statement-filter__content container'>
                    <span className='statement-filter__label'>{localize('Filter by date:')}</span>
                    <DatePicker
                        name='date_from'
                        initial_value=''
                        placeholder={localize('Start date')}
                        startDate={date_to || today}
                        maxDate={date_to || today}
                        onChange={handleDateChange}
                        is_nativepicker={is_mobile}
                    />
                    <span className='statement-filter__dash'>&mdash;</span>
                    <DatePicker
                        name='date_to'
                        initial_value=''
                        placeholder={localize('End date')}
                        startDate={today}
                        minDate={date_from}
                        maxDate={today}
                        showTodayBtn
                        onChange={handleDateChange}
                        is_nativepicker={is_mobile}
                    />
                </div>
            </div>
        );
    }

    render() {
        const { data, is_loading } = this.props;
        return (
            <div className='statement'>

                {this.renderFilter(false)}
                {this.renderFilter(true)}

                <div className='statement__content'>
                    <div className='desktop-only'>
                        <DataTable
                            data_source={data}
                            columns={columns}
                            has_fixed_header
                            is_full_width
                        />
                    </div>
                    <div className='mobile-only'>
                        <CardList
                            data_source={data}
                            Card={StatementCard}
                        />
                    </div>
                    {is_loading && <Loading />}
                    {!is_loading && data.length === 0 && this.renderNoActivityMessage()}
                </div>
            </div>
        );
    }
}

Statement.propTypes = {
    data            : PropTypes.array,
    date_from       : PropTypes.string,
    date_to         : PropTypes.string,
    is_loading      : PropTypes.bool,
    server_time     : PropTypes.object,
    fetchNextBatch  : PropTypes.func,
    handleDateChange: PropTypes.func,
    clearTable      : PropTypes.func,
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
        clearTable      : pages.statement.clearTable,
    })
)(Statement);
