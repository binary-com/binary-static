import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const Statement = () => (
    <React.Fragment>
        <div id='statement-container'>
            <div className='page-title' id='statement-title'>
                <h1>{it.L('Statement')}</h1>
                <div className='loading'><Loading /></div>
                <br />
                <p className='notice-msg center-text invisible' id='error-msg' />
            </div>
            <div className='gr-row gr-padding-10 invisible' id='util_row'>
                <div className='gr-12 gr-12-m'>
                    <div className='gr-row gr-gutter-right gr-row-align-right'>
                        <div className='label_form gr-gutter-right'>
                            <label htmlFor='date_to'>{it.L('End at:')}</label>
                        </div>
                        <div className='gr-gutter-right'>
                            <input type='text' id='date_to' size='20' readOnly='readonly' />
                        </div>
                    </div>
                </div>
                <div className='gr-12 gr-12-m align-end'>
                    <div id='download_csv' className='invisible'>{it.L('[_1] rows displayed:', '<span id=\'rows_count\'></span>')} <a href='javascript:;'>{it.L('Download CSV')}</a></div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Statement;
