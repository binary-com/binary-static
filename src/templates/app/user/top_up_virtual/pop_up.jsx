import React from 'react';

const TopUpVirtualPopup = () => (
    <React.Fragment>
        <div id='top_up' className='gr-padding-10 gr-gutter'>
            <h1>{it.L('Top up Virtual Account')}</h1>
            <p id='top_up_message' />
            <p>{it.L('Do you want to top up for another [_1]? If not, you can do this later on the [_2]Cashier page[_3], too.', '$10,000.00', `<a href='${it.url_for('cashier')}'>`, '</a>')}</p>
            <form id='frm_confirm'>
                <div className='hint no-margin gr-padding-20 gr-parent'>
                    <input id='chk_hide_top_up' type='checkbox' />
                    &nbsp;
                    <label htmlFor='chk_hide_top_up'>{it.L('Don\'t show again')}</label>
                </div>
                <div className='gr-row'>
                    <div className='gr-6'>
                        <a className='button button-secondary' id='cancel' href='javascript:;'><span>{it.L('Continue trading')}</span></a>
                    </div>
                    <div className='gr-6 gr-no-gutter-left'>
                        <button className='button' type='submit' id='topup'>{it.L('Top up')}</button>
                    </div>
                </div>
            </form>
        </div>
        <div id='top_up_error' className='gr-padding-10 gr-gutter'>
            <h1>{it.L('Top up error')}</h1>
            <p id='top_up_error_message' />
            <form id='frm_confirm'>
                <div className='gr-row'>
                    <div className='gr-centered gr-6'>
                        <button className='button' type='submit' id='understood'>{it.L('Understood')}</button>
                    </div>
                </div>
            </form>
        </div>
        <div id='top_up_success' className='gr-padding-10 gr-gutter'>
            <h1>{it.L('Top-up successful')}</h1>
            <p>{it.L('[_1] has been credited into your Virtual Account: [_2].', '$10,000.00', '<span id="client_loginid"></span>')}</p>
            <form id='frm_confirm'>
                <div className='gr-row'>
                    <div className='gr-6'>
                        <a className='button button-secondary' id='statement_redirect' href='javascript:;'><span>{it.L('Go to statement')}</span></a>
                    </div>
                    <div className='gr-6 gr-no-gutter-left'>
                        <button className='button' type='submit' id='continue'>{it.L('Continue trading')}</button>
                    </div>
                </div>
            </form>
        </div>
    </React.Fragment>
);

export default TopUpVirtualPopup;
