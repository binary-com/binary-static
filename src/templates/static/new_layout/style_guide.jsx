import React from 'react';
import Button from '../../../javascript/app_2/pages/trading/components/form/button.jsx';
import InputField from '../../../javascript/app_2/pages/trading/components/form/input_field.jsx';
import DataTable from '../../../javascript/app_2/pages/trading/components/data_table.jsx';
import Pagination from '../../../javascript/app_2/pages/trading/components/pagination.jsx';

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

                <DataTable />
            </div>
        </div>

        <div className='gr-row gr-padding-20'>
            <div className='gr-12'>
                <h2 className='center-text'>Pagination</h2>

                <Pagination total={50} pageSize={10} />
            </div>
        </div>
    </div>
    );

export default StyleGuide;
