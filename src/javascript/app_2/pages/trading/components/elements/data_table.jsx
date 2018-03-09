import React from 'react';
import moment from 'moment';
import Client from '../../../../../app/base/client';
import BinarySocket from '../../../../../app/base/socket';
import { toJapanTimeIfNeeded } from '../../../../../app/base/clock';
import { jpClient } from '../../../../../app/common/country_base';
import { formatMoney } from '../../../../../app/common/currency';
import { localize } from '../../../../../_common/localize';
import { toTitleCase } from '../../../../../_common/string_util';

const Pagination = ({ page, total, page_size, onChange }) => {
    const handleChange = (new_page) => {
        if (new_page === page) return;
        onChange(new_page, calcPagesCount());
    };

    const calcPagesCount = () => Math.ceil(total / page_size);

    const handleNext = () => {
        if (page < calcPagesCount()) {
            handleChange(page + 1);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            handleChange(page - 1);
        }
    };

    const renderEllipsis = (id) => <li className='pagination-item pagination-ellipsis' key={`ellipsis-${id}`} />;

    const renderItem = (page_num) => (
        <li
            className={`pagination-item ${page_num === page ? 'pagination-item-active' : ''}`}
            key={page_num}
            onClick={() => { handleChange(page_num); }}
        >
            <a>{page_num}</a>
        </li>
    );

    const renderItemRange = (first, last) => {
        const items = [];

        for (let page_num = first; page_num <= last; page_num++) {
            items.push(renderItem(page_num));
        }
        return items;
    };

    const renderItems = () => {
        const pages_count = calcPagesCount();

        if (pages_count <= 6) {
            return renderItemRange(1, pages_count);
        }
        else if (page <= 4) {
            return [
                ...renderItemRange(1, 5),
                renderEllipsis(2),
            ];
        }
        else if (pages_count - page < 3) {
            return [
                renderItem(1),
                renderEllipsis(1),
                ...renderItemRange(pages_count - 3, pages_count),
            ];
        }
        // else
        return [
            renderItem(1),
            renderEllipsis(1),
            ...renderItemRange(page - 1, page + 1),
            renderEllipsis(2),
        ];
    };

    return (
        <ul className='pagination'>
            <li
                className={`pagination-prev ${page === 1 ? 'pagination-disabled' : ''}`}
                onClick={handlePrev}
            >
                <a>&lt;</a>
            </li>
            {renderItems()}
            <li
                className={`pagination-next ${page === calcPagesCount() ? 'pagination-disabled' : ''}`}
                onClick={handleNext}
            >
                <a>&gt;</a>
            </li>
        </ul>
    );
};

Pagination.defaultProps = {
    page: 1,
};


/* TODO:
      1. to implement sorting by column (ASC/DESC)
      2. to implement filtering per column
      3. to make pagination more customisable
*/
class DataTable extends React.Component {
    constructor(props) {
        super(props);
        const { data_source, pagination, page_size } = props;

        this.handlePageChange  = this.handlePageChange.bind(this);
        this.renderPagination  = this.renderPagination.bind(this);
        this.handlePageChange  = this.handlePageChange.bind(this);
        this.updateDisplayData = this.updateDisplayData.bind(this);

        this.state = {
            display_data: pagination ? data_source.slice(0, page_size) : data_source,
            page        : 1,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.updateDisplayData(nextProps.data_source, this.state.page, nextProps.page_size);
    }

    updateDisplayData(data_source, page, page_size) {
        const start_id = (page - 1) * page_size;
        const end_id   = start_id + page_size;

        this.setState({
            page,
            display_data: data_source.slice(start_id, end_id),
        });
    }

    handlePageChange(page, pages_count) {
        this.updateDisplayData(this.props.data_source, page, this.props.page_size);

        if (!pages_count) return;

        const { pages_close_to_end, onCloseToEnd } = this.props;
        const pagesLeft = pages_count - page;
        if (pagesLeft <= pages_close_to_end) {
            onCloseToEnd();
        }
    }

    renderPagination() {
        return (
            <div className='table-pagination'>
                <Pagination
                    page={this.state.page}
                    total={this.props.data_source.length}
                    page_size={this.props.page_size}
                    onChange={this.handlePageChange}
                />
            </div>
        );
    }

    renderRow(transaction, id) {
        const defaultRenderCell = (data, data_index) => <td className={data_index} key={data_index}>{data}</td>;

        return (
            <tr className='table-row' key={id}>
                {this.props.columns.map(({ data_index, renderCell }) => (
                    (renderCell || defaultRenderCell)(transaction[data_index], data_index, transaction)
                ))}
            </tr>
        );
    }

    renderBodyRows() {
        return this.state.display_data.map((transaction, id) => this.renderRow(transaction, id));
    }

    renderHeaders() {
        return this.props.columns.map(col => <th key={col.data_index}>{col.title}</th>);
    }

    render() {
        const { pagination } = this.props;

        return (
            <div className='table-container'>
                <table className='table'>
                    <thead className='table-thead'>
                        <tr className='table-row'>
                            {this.renderHeaders()}
                        </tr>
                    </thead>

                    <tbody className='table-tbody'>
                        {this.renderBodyRows()}
                    </tbody>
                </table>

                {pagination && this.renderPagination()}
            </div>
        );
    }
}

DataTable.defaultProps = {
    pagination        : true,
    pages_close_to_end: 5,
};


// TODO: to move the statement code to its own component
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

export class StatementDataTable extends React.PureComponent {
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
        const is_jp_client = jpClient();

        BinarySocket.send(req).then((response) => {
            console.log('next batch', response);

            const formatted_transactions = response.statement.transactions
                .map(transaction => getStatementData(transaction, currency, is_jp_client));

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

export default DataTable;
