import React from 'react';

const transactions = [
    {
        balance_after: 10150.1300,
        transaction_id: 10867502908,
        reference_id: 45143958928,
        transaction_time: 1441175849,
        action_type: 'Sell',
        amount: -83.2300,
        longcode: 'Win payout if the last digit of Volatility 25 Index is 7 after 5 ticks.',
        payout: 90.91
    },
    {
        balance_after: 10150.1300,
        transaction_id: 10867502908,
        reference_id: 45143958928,
        transaction_time: 1441175849,
        action_type: 'Buy',
        amount: -83.2300,
        longcode: 'Win payout if the last digit of Volatility 25 Index is 7 after 5 ticks.',
        payout: 90.91
    },
    {
        balance_after: 10150.1300,
        transaction_id: 10867502908,
        reference_id: 45143958928,
        transaction_time: 1441175849,
        action_type: 'Sell',
        amount: -83.2300,
        longcode: 'Win payout if the last digit of Volatility 25 Index is 7 after 5 ticks.',
        payout: 90.91
    }
];

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

export const DataTable = ({ dataSource = transactions, columns = statement_columns }) => {
    return (
        <table className='table'>
            <thead className='table-thead'>
                <tr className='table-row'>
                    {columns.map(col => (
                        <th key={col.dataIndex}>{col.title}</th>
                    ))}
                </tr>
            </thead>

            <tbody className='table-tbody'>
                {dataSource.map(obj => (
                    <tr className='table-row'>
                        {columns.map(({ dataIndex }) => (
                            <td>{obj[dataIndex]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;