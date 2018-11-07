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
                <AccountStatisticsBox title={it.L('Account statistics')} className='fill-bg-color' />
                <AccountStatisticsBox id='total_deposits'    heading={it.L('Total deposits')} />
                <AccountStatisticsBox id='total_withdrawals' heading={it.L('Total withdrawals')} />
                <AccountStatisticsBox id='net_deposits'      heading={it.L('Net deposits')} />
            </div>

            <div id='util_row' className='gr-row gr-padding-10 gr-parent invisible container'>
                <div className='gr-12 gr-12-m'>
                    <div className='gr-row gr-row-align-right gr-row-align-left-m gr-row-align-middle'>
                        <div>
                            <label className='label_form gr-gutter-right'>{it.L('Show all historical transactions up to')}:</label>
                            <input type='text' id='date_to' size='20' readOnly='readonly' className='no-margin' />
                        </div>
                        <button className='button-secondary invisible' id='download_statement_btn'>{it.L('Download your statement')}</button>
                    </div>
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
            <div className='gr-row gr-row-align-center-m'>
                <div className='gr-4 gr-5-t gr-5-p gr-12-m gr-padding-10'>
                    <label htmlFor='date_to'>{it.L('From')}:</label>
                    <input type='text' id='download_from' size='20' readOnly='readonly' />
                </div>
                <div className='gr-4 gr-5-t gr-5-p gr-12-m gr-padding-10'>
                    <label htmlFor='date_to'>{it.L('To')}:</label>
                    <input type='text' id='download_to' size='20' readOnly='readonly' />
                </div>
                <div className='gr-12 gr-padding-30'>
                    <div className='gr-row gr-row-align-center-m container'>
                        <a id='request_statement_btn' className='button button-disabled no-margin'>
                            <span>{it.L('Request your statement')}</span>
                        </a>
                        <a id='go_back_btn' href='javascript:;' className='gr-gutter-right gr-gutter-left'>
                            <div className='gr-row gr-padding-10 container'>
                                <span className='gr-hide gr-show-m'>{('<<')}&nbsp;</span>{it.L('Back to Statement')}
                            </div>
                        </a>
                    </div>
                    <p className='success-msg invisible'>{it.L('Your statement has been sent to your email address.')}</p>
                    <p className='error-msg invisible'>{it.L('There was an error processing your request.')}</p>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Statement;
