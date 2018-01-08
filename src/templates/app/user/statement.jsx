import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const Statement = () => (
    <React.Fragment>
        <div id='statement-container'>
            <div className='page-title' id='statement-title'>
                <h1>{it.L('Statement')}</h1>
                <div className='loading'><Loading /></div>
                <br />
                <p className='notice-msg center-text invisible' id='error-msg'></p>
            </div>
            <div className='gr-row gr-padding-10 invisible' id='util_row'>
                <div className='gr-6 gr-12-m'>
                    <div className='gr-row gr-gutter-left'>
                        <div className='label_form gr-gutter-left'>
                            <label htmlFor='jump-to'>{it.L('Start from:')}</label>
                        </div>
                        <div className='gr-gutter-left'>
                            <input type='text' id='jump-to' size='20' readOnly='readonly' />
                        </div>
                    </div>
                </div>
                <div className='gr-6 gr-12-m align-end'>
                    <div id='download_csv' className='invisible'>{it.L('[_1] rows displayed:', '<span id=\'rows_count\'></span>')} <a href='javascript:;'>{it.L('Download CSV')}</a></div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Statement;
