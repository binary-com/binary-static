import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const ProfitTable = () => (
    <React.Fragment>
        <div id='profit-table-container'>
            <div className='page-title' id='profit-table-title'>
                <h1>{it.L('Profit Table')}</h1>
                <div className='loading'><Loading /></div>
                <br />
                <p className='notice-msg center-text invisible' id='error-msg'></p>
            </div>
        </div>
    </React.Fragment>
);

export default ProfitTable;
