import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const ProfitTable = () => (
    <React.Fragment>
        <div id='profit-table-container'>
            <div className='page-title' id='profit-table-title'>
                <h1>{it.L('Profit Table')}</h1>
                <div className='loading'><Loading /></div>
                <br />
                <p className='notice-msg center-text invisible' id='error-msg' />
            </div>
            <div className='gr-padding-10 invisible' id='util_row'>
                <div className='gr-row gr-gutter-right gr-row-align-right'>
                    <div className='label_form gr-gutter-right'>
                        <label htmlFor='date_to'>{it.L('End at:')}</label>
                    </div>
                    <div className='gr-gutter-right'>
                        <input type='text' id='date_to' size='20' readOnly='readonly' />
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default ProfitTable;
