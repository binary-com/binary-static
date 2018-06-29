import React             from 'react';
import PropTypes         from 'prop-types';
import Filter            from './filter.jsx';
import AmountCell        from '../Components/amount_cell.jsx';
import NoActivityMessage from '../Components/no_activity_message.jsx';
import StatementCard     from '../Components/statement_card.jsx';
import CardList          from '../../../components/elements/card_list.jsx';
import DataTable         from '../../../components/elements/data_table.jsx';
import { connect }       from '../../../Stores/connect';
import { localize }      from '../../../../_common/localize';
import Loading           from '../../../../../templates/_common/components/loading.jsx';

export class Statement extends React.PureComponent {
    columns = [
        { title: localize('Date'),             data_index: 'date' },
        { title: localize('Ref.'),             data_index: 'refid' },
        { title: localize('Description'),      data_index: 'desc' },
        { title: localize('Action'),           data_index: 'action' },
        { title: localize('Potential Payout'), data_index: 'payout' },
        { title: localize('Credit/Debit'),     data_index: 'amount', renderCell: AmountCell },
        { title: localize('Balance'),          data_index: 'balance' },
    ];

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
    };

    render() {
        const { data, date_from, date_to, is_loading } = this.props;
        const has_selected_date = !!(date_from || date_to);

        return (
            <div className='statement'>

                <Filter {...this.props} />
                <Filter {...this.props} is_mobile />

                <div className='statement__content'>
                    <div className='desktop-only'>
                        <DataTable
                            data_source={data}
                            columns={this.columns}
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
                    {is_loading &&
                        <Loading />
                    }
                    {!is_loading && data.length === 0 &&
                        <NoActivityMessage has_selected_date={has_selected_date} />
                    }
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
    fetchNextBatch  : PropTypes.func,
    handleDateChange: PropTypes.func,
    clearTable      : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        data            : modules.statement.data,
        is_loading      : modules.statement.is_loading,
        has_loaded_all  : modules.statement.has_loaded_all,
        date_from       : modules.statement.date_from,
        date_to         : modules.statement.date_to,
        fetchNextBatch  : modules.statement.fetchNextBatch,
        handleDateChange: modules.statement.handleDateChange,
        clearTable      : modules.statement.clearTable,
    })
)(Statement);
