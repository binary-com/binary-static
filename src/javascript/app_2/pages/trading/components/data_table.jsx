import React from 'react';
import moment from 'moment';
import BinarySocket from '../../../../app/base/socket';
import Client from '../../../../app/base/client';
import { jpClient } from '../../../../app/common/country_base';
import { formatMoney } from '../../../../app/common/currency';
import { localize } from '../../../../_common/localize';
import { toTitleCase } from '../../../../_common/string_util';

const Pagination = ({ page, total, pageSize, onChange }) => {
    const handleChange = (newPage) => {
        if (newPage === page) return;
        onChange(newPage);
    };

    const calcNumOfPages = () => {
        return Math.ceil(total / pageSize);
    };

    const handleNext = () => {
        if (page < calcNumOfPages()) {
            handleChange(page + 1);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            handleChange(page - 1);
        }
    };

    const renderEllipsis = (id) => {
        return (
            <li
                className='pagination-item pagination-ellipsis'
                key={`ellipsis-${id}`}
            >
            </li>
        );
    };

    const renderItem = (pageNum) => {
        return (
            <li
                className={`pagination-item ${pageNum === page ? 'pagination-item-active' : ''}`}
                key={pageNum}
                onClick={() => {
                    handleChange(pageNum)
                }}
            >
                <a>{pageNum}</a>
            </li>
        );
    };

    const renderItemRange = (first, last) => {
        const items = [];

        for (let pageNum = first; pageNum <= last; pageNum++) {
            items.push(renderItem(pageNum));
        }
        return items;
    };

    const renderItems = () => {
        const numOfPages = calcNumOfPages();

        if (numOfPages <= 6) {
            return renderItemRange(1, numOfPages);
        }
        else if (page <= 4) {
            return [
                ...renderItemRange(1, 5),
                renderEllipsis(2)
            ];
        }
        else if (numOfPages - page < 3) {
            return [
                renderItem(1),
                renderEllipsis(1),
                ...renderItemRange(numOfPages - 3, numOfPages)
            ];
        }
        else {
            return [
                renderItem(1),
                renderEllipsis(1),
                ...renderItemRange(page - 1, page + 1),
                renderEllipsis(2)
            ];
        }
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
                className={`pagination-next ${page === calcNumOfPages() ? 'pagination-disabled' : ''}`}
                onClick={handleNext}
            >
                <a>&gt;</a>
            </li>
        </ul>
    );
}

Pagination.defaultProps = {
    page: 1
};


class DataTable extends React.Component {
    constructor(props) {
        super(props);
        const { dataSource, pagination, pageSize } = props;

        this.handlePageChange = this.handlePageChange.bind(this);
        this.renderPagination = this.renderPagination.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

        this.state = {
            displayData: pagination ? dataSource.slice(0, pageSize) : dataSource
        }
    }

    componentWillReceiveProps(nextProps) {
        const { dataSource, pageSize } = nextProps;

        this.setState({
            displayData: dataSource.slice(0, pageSize),
            page: 1
        })
    }

    handlePageChange(page) {
        const { pageSize } = this.props;
        const startId = (page - 1) * pageSize;
        const endId = startId + pageSize;

        this.setState({
            page: page,
            displayData: this.props.dataSource.slice(startId, endId)
        });
    }

    renderPagination() {
        return (
            <div className='table-pagination'>
                <Pagination
                    page={this.state.page}
                    total={this.props.dataSource.length}
                    pageSize={this.props.pageSize}
                    onChange={this.handlePageChange}
                />
            </div>
        );
    }

    renderRow(transaction, id) {
        const defaultRenderCell = (data, dataIndex) => <td className={dataIndex} key={dataIndex}>{data}</td>;

        return (
            <tr className='table-row' key={id}>
                {this.props.columns.map(({ dataIndex, renderCell }) => {
                    if (!renderCell) renderCell = defaultRenderCell;
                    return renderCell(transaction[dataIndex], dataIndex);
                })}
            </tr>
        );
    }

    renderBodyRows() {
        return this.state.displayData.map((transaction, id) => this.renderRow(transaction, id));
    }

    renderHeaders() {
        return this.props.columns.map(col => <th key={col.dataIndex}>{col.title}</th>);
    }

    render() {
        const { dataSource, columns, pagination, pageSize } = this.props;
        const { displayData } = this.state;

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
    pagination: true
};

class StatementDataTable extends React.PureComponent {
    constructor(props) {
        super(props);

        this.getNextBatch = this.getNextBatch.bind(this);

        const columns = [
            {
                title: localize('Date'),
                dataIndex: 'date',
            },
            {
                title: localize('Ref.'),
                dataIndex: 'ref',
            },
            {
                title: localize('Potential Payout'),
                dataIndex: 'payout',
            },
            {
                title: localize('Action'),
                dataIndex: 'action',
            },
            {
                title: localize('Description'),
                dataIndex: 'desc',
            },
            {
                title: localize('Credit/Debit'),
                dataIndex: 'amount',
                renderCell: (data, dataIndex) => {
                    const parseStrNum = (str) => {
                        return parseFloat(str.replace(',', '.'));
                    }
                    return <td className={`${dataIndex} ${(parseStrNum(data) >= 0) ? 'profit' : 'loss'}`} key={dataIndex}>{data}</td>
                }
            },
            {
                title: localize('Balance'),
                dataIndex: 'balance',
            }
        ];

        this.state = {
            dataSource: [],
            columns: columns
        };
    }

    getStatementData(statement, currency, jp_client) {
        const date_obj   = new Date(statement.transaction_time * 1000);
        const moment_obj = moment.utc(date_obj);
        const date_str   = moment_obj.format('YYYY-MM-DD');
        const time_str   = `${moment_obj.format('HH:mm:ss')} GMT`;
        const payout     = parseFloat(statement.payout);
        const amount     = parseFloat(statement.amount);
        const balance    = parseFloat(statement.balance_after);
        const is_ico_bid = /binaryico/i.test(statement.shortcode);

        let action = localize(toTitleCase(statement.action_type));
        if (is_ico_bid) {
            action = /buy/i.test(statement.action_type) ? localize('Bid') : localize('Closed Bid');
        }

        return {
            action,
            date   : jp_client ? toJapanTimeIfNeeded(+statement.transaction_time) : `${date_str}\n${time_str}`,
            ref    : statement.transaction_id,
            payout : isNaN(payout) || is_ico_bid ? '-' : formatMoney(currency, payout, !jp_client),
            amount : isNaN(amount) ? '-' : formatMoney(currency, amount, !jp_client),
            balance: isNaN(balance) ? '-' : formatMoney(currency, balance, !jp_client),
            desc   : localize(statement.longcode.replace(/\n/g, '<br />')),
            id     : statement.contract_id,
            app_id : statement.app_id,
        };
    }

    componentDidMount() {
        // BinarySocket.send({ oauth_apps: 1 }).then((response) => {
        //     console.log('oauth response', response);
        // });
        this.getNextBatch();
    }

    getNextBatch() {
        const batch_size = 200;
        const req = {
            statement: 1,
            description: 1,
            limit: batch_size,
            offset: this.state.dataSource.length
        };

        const currency = Client.get('currency');
        const jp_client = jpClient();

        BinarySocket.send(req).then((response) => {
            const formattedTransactions = response.statement.transactions
                .map(transaction => this.getStatementData(transaction, currency, jp_client));

            this.setState({
                dataSource: [...this.state.dataSource, ...formattedTransactions]
            })
        });
    }

    render() {
        return (
            <DataTable
                {...this.props}
                dataSource={this.state.dataSource}
                columns={this.state.columns}
                onLastPage={this.getNextBatch}
            />
        );
    }
}

export default StatementDataTable;


// REMOVE later:
// generate dummy data for the DataTable
export const transactions = Array(150).fill(0).map((_, i) => {
    return {
        balance_after: 10150.1300,
        transaction_id: (10867502908 - i),
        reference_id: (45143958928 - i),
        transaction_time: (1441175849 - i * 100),
        action_type: (i % 2 ? 'Sell' : 'Buy'),
        amount: -83.2300,
        longcode: 'Win payout if the last digit of Volatility 25 Index is 7 after 5 ticks.',
        payout: 90.91
    };
});

export const statement_columns = [
    {
        title: 'Date',
        dataIndex: 'transaction_time'
    },
    {
        title: 'Ref.',
        dataIndex: 'reference_id'
    },
    {
        title: 'Potential payout',
        dataIndex: 'payout'
    },
    {
        title: 'Action',
        dataIndex: 'action_type'
    },
    {
        title: 'Description',
        dataIndex: 'longcode'
    },
    {
        title: 'Credit/Debit',
        dataIndex: 'amount'
    },
    {
        title: 'Balance (USD)',
        dataIndex: 'balance_after'
    }
];