import React from 'react';
import Pagination from './pagination';

// generate dummy data
const transactions = Array(150).fill(0).map((_, i) => {
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

const statement_columns = [
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

    handlePageChange(page, pageSize) {
        const startId = (page - 1) * pageSize;
        const endId = startId + pageSize;

        this.setState({
            displayData: this.props.dataSource.slice(startId, endId)
        });
    }

    renderPagination() {
        return (
            <Pagination
                total={this.props.dataSource.length}
                pageSize={this.props.pageSize}
                onChange={this.handlePageChange}
            />
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
                                <th key={col.dataindex}>{col.title}</th>
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
    dataSource: transactions,
    columns: statement_columns,
    pagination: true,
    pageSize: 6
};

export default DataTable;