import React from 'react';
import Button from '../../../javascript/app_2/pages/trading/components/form/button.jsx';
import InputField from '../../../javascript/app_2/pages/trading/components/form/input_field.jsx';
import DataTable from '../../../javascript/app_2/pages/trading/components/data_table.jsx';

// generate dummy data for the DataTable
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


const StyleGuide = () => (
    <div className='container'>
        <div className='gr-row gr-padding-20'>
            <div className='gr-8 gr-12-m'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2 className='center-text'>Buttons</h2>
                    </div>
                </div>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <Button
                            id='test_btn'
                            className='primary orange'
                            text='primary'
                            has_effect
                        />
                        <Button
                            id ='test_btn'
                            className='primary green'
                            text='primary'
                            has_effect
                        />
                        <Button
                            id ='test_btn'
                            className='primary green'
                            text='primary'
                            has_effect
                            is_disabled
                        />
                    </div>
                    <div className='gr-12'>
                        <Button
                            id ='test_btn'
                            className='secondary orange'
                            text='secondary'
                            has_effect
                        />
                        <Button
                            id='test_btn'
                            className='secondary green'
                            text='secondary'
                            has_effect
                        />
                        <Button
                            id='test_btn'
                            className='secondary green'
                            text='secondary'
                            has_effect
                            is_disabled
                        />
                    </div>
                    <div className='gr-12 gr-centered'>
                        <Button
                            id='test_btn'
                            className='flat'
                            text='is used in a card'
                            has_effect
                        />
                    </div>
                </div>
            </div>
            <div className='gr-4 gr-12-m'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2 className='center-text'>Input Field</h2>
                    </div>
                </div>
                <div className='gr-row gr-padding-20'>
                    <div className='gr-12'>
                        <InputField
                            type='text'
                            name='text'
                            placeholder='Placeholder Text'
                            label='Text Field'
                            helper='Helper messages go here'
                        />
                    </div>
                </div>
                <div className='gr-row gr-padding-20'>
                    <div className='gr-12'>
                        <InputField
                            type='number'
                            name='number'
                            placeholder='Placeholder Number'
                            label='Numbers Field'
                            helper='Helper messages go here'
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className='gr-row gr-padding-20'>
            <div className='gr-12'>
                <h2 className='center-text'>Data Table</h2>

                <DataTable dataSource={transactions} columns={statement_columns} pagination pageSize={6} />
            </div>
        </div>
    </div>
    );

export default StyleGuide;
