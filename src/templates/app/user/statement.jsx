import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const AccountStatisticsBox = ({ id, title, heading, className }) => (
    <div className={`gr-3 gr-12-m ${className || ''}`}>
        { title ?
            <p className='title'>{title}</p>
            :
            <span className='hint'>{heading}</span>
        }
        { id && <p id={id} /> }
    </div>
);

const Statement = () => (
    <React.Fragment>
        <div id='statement-container'>
            <div className='page-title' id='statement-title'>
                <h1>{it.L('Statement')}</h1>
                <p className='notice-msg center-text invisible' id='error-msg' />
            </div>
            <div id='account_statistics' className='gr-row invisible'>
                <AccountStatisticsBox title={it.L('Account statistics')} />
                <AccountStatisticsBox id='total_deposits'    heading={it.L('Total deposits')} />
                <AccountStatisticsBox id='total_withdrawals' heading={it.L('Total withdrawals')} />
                <AccountStatisticsBox id='net_deposits'      heading={it.L('Net deposits')} className='fill-bg-color' />
            </div>
            <div className='gr-row gr-padding-10 invisible' id='util_row'>
                <div className='gr-12 gr-12-m'>
                    <div className='gr-row gr-gutter-right gr-row-align-right'>
                        <div className='label_form gr-gutter-right'>
                            <label>{it.L('Show all historical transactions up to')}:</label>
                        </div>
                        <div className='gr-gutter-right'>
                            <input type='text' id='date_to' size='20' readOnly='readonly' />
                        </div>
                    </div>
                </div>
                <div className='gr-12 gr-12-m align-end gr-padding-10 gr-child'>
                    <button className='button-secondary invisible' id='download_statement_btn'>{it.L('Download your statement')}</button>
                </div>
                <div className='gr-12 gr-12-m align-end'>
                    <div id='download_csv' className='invisible'>{it.L('[_1] rows displayed:', '<span id=\'rows_count\'></span>')} <a href='javascript:;'>{it.L('Download CSV')}</a></div>
                </div>
            </div>
            <Loading />
        </div>

        <div id='download_statement_container' className='invisible'>
            <div className='page-title'>
                <h1>{it.L('Download your statement')}</h1>
            </div>
            <p>{it.L('Please select the date range of your statement:')}</p>
            <div className='gr-row'>
                <div className='gr-4 gr-5-t gr-5-p gr-12-m'>
                    <div className='label_form gr-gutter-right'>
                        <label htmlFor='date_to'>{it.L('From')}:</label>
                        <input type='text' id='download_from' size='20' readOnly='readonly' />
                    </div>
                </div>
                <div className='gr-4 gr-5-t gr-5-p gr-12-m'>
                    <div className='label_form gr-gutter-right'>
                        <label htmlFor='date_to'>{it.L('To')}:</label>
                        <input type='text' id='download_to' size='20' readOnly='readonly' />
                    </div>
                </div>
                <div className='gr-12 gr-padding-30'>
                    <a id='request_statement_btn' className='button button-disabled'>
                        <span>{it.L('Request your statement')}</span>
                    </a>
                    <p className='success-msg invisible'>{it.L('Your statement has been sent to your email address.')}</p>
                    <p className='error-msg invisible'>{it.L('There was an error processing your request.')}</p>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Statement;
