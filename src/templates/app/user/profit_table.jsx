import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const ProfitTable = () => (
    <React.Fragment>
        <div id='profit-table-container'>
            <div className='page-title' id='profit-table-title'>
                <h1>{it.L('Profit Table')}</h1>
                <p className='notice-msg center-text invisible' id='error-msg' />
            </div>
            <div className='gr-padding-10 invisible' id='util_row'>
                <div className='gr-row container gr-row-align-left-m gr-row-align-right'>
                    <label className='gr-gutter-right'>{it.L('Show all historical transactions up to')}:</label>
                    <input type='text' id='date_to' size='20' readOnly='readonly' className='no-margin' />
                </div>
            </div>
            <Loading />
        </div>
    </React.Fragment>
);

export default ProfitTable;
