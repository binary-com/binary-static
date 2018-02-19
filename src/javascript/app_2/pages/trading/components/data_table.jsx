import React from 'react';
import moment from 'moment';
import BinarySocket from '../../../../app/base/socket';
import Client from '../../../../app/base/client';
import { jpClient } from '../../../../app/common/country_base';
import { formatMoney } from '../../../../app/common/currency';
import { localize } from '../../../../_common/localize';
import { toTitleCase } from '../../../../_common/string_util';

class Pagination extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.calcNumOfPages = this.calcNumOfPages.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleJumpUp = this.handleJumpUp.bind(this);
        this.handleJumpDown = this.handleJumpDown.bind(this);
        this.renderUpEllipsis = this.renderUpEllipsis.bind(this);
        this.renderDownEllipsis = this.renderDownEllipsis.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderItemRange = this.renderItemRange.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.state = {
            current: 1
        };
    }

    handleChange(newPage) {
        if (newPage === this.state.current) return;

        this.setState({
            current: newPage
        });

        this.props.onChange(newPage);
    }

    calcNumOfPages() {
        const { total, pageSize } = this.props;
        return Math.ceil(total / pageSize);
    }

    handleNext() {
        if (this.state.current < this.calcNumOfPages()) {
            this.handleChange(this.state.current + 1);
        }
    }

    handlePrev() {
        if (this.state.current > 1) {
            this.handleChange(this.state.current - 1);
        }
    }

    handleJumpUp() {
        this.handleChange(Math.min(
            this.state.current + 5,
            this.calcNumOfPages()
        ));
    }

    handleJumpDown() {
        this.handleChange(Math.max(
            1,
            this.state.current - 5
        ));
    }

    renderUpEllipsis() {
        return (
            <li
                className='pagination-item pagination-ellipsis-up'
                key='ellipsis-up'
                onClick={this.handleJumpUp}
            >
            </li>
        );
    }

    renderDownEllipsis() {
        return (
            <li
                className='pagination-item pagination-ellipsis-down'
                key='ellipsis-down'
                onClick={this.handleJumpDown}
            >
            </li>
        );
    }

    renderItem(pageNum) {
        return (
            <li
                className={`pagination-item ${pageNum === this.state.current ? 'pagination-item-active' : ''}`}
                key={pageNum}
                onClick={() => {
                    this.handleChange(pageNum)
                }}
            >
                <a>{pageNum}</a>
            </li>
        );
    }

    renderItemRange(first, last) {
        const items = [];

        for (let pageNum = first; pageNum <= last; pageNum++) {
            items.push(this.renderItem(pageNum));
        }
        return items;
    }

    renderItems() {
        const numOfPages = this.calcNumOfPages();
        const { current } = this.state;

        if (numOfPages <= 9) {
            return this.renderItemRange(1, numOfPages);
        }
        else if (current <= 3) {
            return [
                ...this.renderItemRange(1, 5),
                this.renderUpEllipsis(),
                this.renderItem(numOfPages)
            ];
        }
        else if (current === 4) {
            return [
                ...this.renderItemRange(1, 6),
                this.renderUpEllipsis(),
                this.renderItem(numOfPages)
            ];
        }
        else if (current === numOfPages - 3) {
            return [
                this.renderItem(1),
                this.renderDownEllipsis(),
                ...this.renderItemRange(numOfPages - 5, numOfPages)
            ];
        }
        else if (numOfPages - current < 3) {
            return [
                this.renderItem(1),
                this.renderDownEllipsis(),
                ...this.renderItemRange(numOfPages - 4, numOfPages)
            ];
        }
        else {
            return [
                this.renderItem(1),
                this.renderDownEllipsis(),
                ...this.renderItemRange(current - 2, current + 2),
                this.renderUpEllipsis(),
                this.renderItem(numOfPages)
            ];
        }
    }

    render() {
        const { current } = this.state;
        return (
            <ul className='pagination'>
                <li
                    className={`pagination-prev ${current === 1 ? 'pagination-disabled' : ''}`}
                    onClick={this.handlePrev}
                >
                    <a>&lt;</a>
                </li>
                {this.renderItems()}
                <li
                    className={`pagination-next ${current === this.calcNumOfPages() ? 'pagination-disabled' : ''}`}
                    onClick={this.handleNext}
                >
                    <a>&gt;</a>
                </li>
            </ul>
        );
    }
}

Pagination.defaultProps = {
    total: 0,
    pageSize: 10,
    onChange: (page) => {console.log(page)}
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
            displayData: this.props.dataSource.slice(startId, endId)
        });
    }

    renderPagination() {
        return (
            <div className='table-pagination'>
                <Pagination
                    total={this.props.dataSource.length}
                    pageSize={this.props.pageSize}
                    onChange={this.handlePageChange}
                />
            </div>
        );
    }

    render() {
        const { dataSource, columns, pagination, pageSize } = this.props;
        const { displayData } = this.state;

        return (
            <div className='table-container'>
                <table className='table'>
                    <thead className='table-thead'>
                        <tr className='table-row'>
                            {columns.map(col => (
                                <th key={col.dataIndex}>{col.title}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className='table-tbody'>
                        {displayData.map((obj, id) => (
                            <tr className='table-row' key={id}>
                                {columns.map(({ dataIndex }) => (
                                    <td key={dataIndex}>{obj[dataIndex]}</td>
                                ))}
                            </tr>
                        ))}
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

        const columns  = ['date', 'ref', 'payout', 'action', 'desc', 'amount', 'balance'];
        const header = [
            localize('Date'),
            localize('Ref.'),
            localize('Potential Payout'),
            localize('Action'),
            localize('Description'),
            localize('Credit/Debit'),
            localize('Balance'),
        ];

        this.state = {
            dataSource: [],
            columns: columns.map((col_id, i) => {
                return {
                    title: header[i],
                    dataIndex: col_id
                };
            })
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

        let action = toTitleCase(statement.action_type);
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
            desc   : statement.longcode.replace(/\n/g, '<br />'),
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