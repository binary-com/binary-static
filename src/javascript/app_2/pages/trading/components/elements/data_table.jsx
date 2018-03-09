import React from 'react';
import moment from 'moment';
import Client from '../../../../../app/base/client';
import BinarySocket from '../../../../../app/base/socket';
import { toJapanTimeIfNeeded } from '../../../../../app/base/clock';
import { jpClient } from '../../../../../app/common/country_base';
import { formatMoney } from '../../../../../app/common/currency';
import { localize } from '../../../../../_common/localize';
import { toTitleCase } from '../../../../../_common/string_util';

const Pagination = ({ page, total, pageSize, onChange }) => {
    const handleChange = (newPage) => {
        if (newPage === page) return;
        onChange(newPage, calcNumOfPages());
    };

    const calcNumOfPages = () => Math.ceil(total / pageSize);

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

    const renderEllipsis = (id) => <li className='pagination-item pagination-ellipsis' key={`ellipsis-${id}`} />;

    const renderItem = (pageNum) => (
        <li
            className={`pagination-item ${pageNum === page ? 'pagination-item-active' : ''}`}
            key={pageNum}
            onClick={() => { handleChange(pageNum); }}
        >
            <a>{pageNum}</a>
        </li>
    );

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
                renderEllipsis(2),
            ];
        }
        else if (numOfPages - page < 3) {
            return [
                renderItem(1),
                renderEllipsis(1),
                ...renderItemRange(numOfPages - 3, numOfPages),
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
                className={`pagination-next ${page === calcNumOfPages() ? 'pagination-disabled' : ''}`}
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


class DataTable extends React.Component {
    constructor(props) {
        super(props);
        const { dataSource, pagination, pageSize } = props;

        this.handlePageChange  = this.handlePageChange.bind(this);
        this.renderPagination  = this.renderPagination.bind(this);
        this.handlePageChange  = this.handlePageChange.bind(this);
        this.updateDisplayData = this.updateDisplayData.bind(this);

        this.state = {
            displayData: pagination ? dataSource.slice(0, pageSize) : dataSource,
            page       : 1,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.updateDisplayData(nextProps.dataSource, this.state.page, nextProps.pageSize);
    }

    updateDisplayData(dataSource, page, pageSize) {
        const startId = (page - 1) * pageSize;
        const endId = startId + pageSize;

        this.setState({
            page,
            displayData: dataSource.slice(startId, endId),
        });
    }

    handlePageChange(page, numOfPages) {
        this.updateDisplayData(this.props.dataSource, page, this.props.pageSize);

        if (!numOfPages) return;

        const { pagesCloseToEnd, onCloseToEnd } = this.props;
        const pagesLeft = numOfPages - page;
        if (pagesLeft <= pagesCloseToEnd) {
            onCloseToEnd();
        }
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
                {this.props.columns.map(({ dataIndex, renderCell }) => (
                    (renderCell || defaultRenderCell)(transaction[dataIndex], dataIndex, transaction)
                ))}
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
    pagination     : true,
    pagesCloseToEnd: 5,
};


// TODO: to move the statement code to its own component
const getStatementData = (statement, currency, jp_client) => {
    const date_obj   = new Date(statement.transaction_time * 1000);
    const moment_obj = moment.utc(date_obj);
    const date_str   = moment_obj.format('YYYY-MM-DD');
    const time_str   = `${moment_obj.format('HH:mm:ss')} GMT`;
    const payout     = parseFloat(statement.payout);
    const amount     = parseFloat(statement.amount);
    const balance    = parseFloat(statement.balance_after);

    return {
        action : localize(toTitleCase(statement.action_type)),
        date   : jp_client ? toJapanTimeIfNeeded(+statement.transaction_time) : `${date_str}\n${time_str}`,
        ref    : statement.transaction_id,
        payout : isNaN(payout)  ? '-' : formatMoney(currency, payout,  !jp_client),
        amount : isNaN(amount)  ? '-' : formatMoney(currency, amount,  !jp_client),
        balance: isNaN(balance) ? '-' : formatMoney(currency, balance, !jp_client),
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
                title    : localize('Date'),
                dataIndex: 'date',
            },
            {
                title    : localize('Ref.'),
                dataIndex: 'ref',
            },
            {
                title    : localize('Potential Payout'),
                dataIndex: 'payout',
            },
            {
                title    : localize('Action'),
                dataIndex: 'action',
            },
            {
                title    : localize('Description'),
                dataIndex: 'desc',
            },
            {
                title     : localize('Credit/Debit'),
                dataIndex : 'amount',
                renderCell: (data, dataIndex) => {
                    const parseStrNum = (str) => parseFloat(str.replace(',', '.'));
                    return <td className={`${dataIndex} ${(parseStrNum(data) >= 0) ? 'profit' : 'loss'}`} key={dataIndex}>{data}</td>;
                },
            },
            {
                title    : localize('Balance'),
                dataIndex: 'balance',
            },
        ];

        this.state = {
            columns,
            dataSource           : [],
            loadedAllTransactions: false,
        };
    }

    componentDidMount() {
        // BinarySocket.send({ oauth_apps: 1 }).then((response) => {
        //     console.log('oauth response', response);
        // });
        this.getNextBatch();
    }

    getNextBatch() {
        if (this.state.loadedAllTransactions) return;

        const BATCH_SIZE = 200;
        const req = {
            statement  : 1,
            description: 1,
            limit      : BATCH_SIZE,
            offset     : this.state.dataSource.length,
        };

        const currency  = Client.get('currency');
        const jp_client = jpClient();

        BinarySocket.send(req).then((response) => {
            console.log('next batch', response);

            const formattedTransactions = response.statement.transactions
                .map(transaction => getStatementData(transaction, currency, jp_client));

            this.setState({
                dataSource           : [...this.state.dataSource, ...formattedTransactions],
                loadedAllTransactions: formattedTransactions.length < BATCH_SIZE,
            });
        });
    }

    render() {
        return (
            <DataTable
                {...this.props}
                dataSource={this.state.dataSource}
                columns={this.state.columns}
                onCloseToEnd={this.getNextBatch}
            />
        );
    }
}

export default DataTable;
