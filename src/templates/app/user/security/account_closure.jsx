import React from 'react';
import { SubmitButton } from '../../../_common/components/forms.jsx';
import Loading from '../../../_common/components/loading.jsx';

const leaving_reason_list = [
    { title: it.L('I have other financial priorities.'), id: 'other_priorities' },
    { title: it.L('I want to stop myself from trading.'), id: 'stop_trading' },
    { title: it.L('I\'m no longer interested in trading.'), id: 'not_interested' },
    { title: it.L('I prefer another trading website.'), id: 'other_website' },
    { title: it.L('The platforms aren\'t user-friendly.'), id: 'not_user_friendly' },
    { title: it.L('Making deposits and withdrawals is difficult.'), id: 'difficult' },
    { title: it.L('The platforms lack key features or functionality.'), id: 'platform_lack' },
    { title: it.L('Customer service was unsatisfactory.'), id: 'customer_service' },
    { title: it.L('I\'m deactivating my account for other reasons.'), id: 'other' },
];

const AccountClosureDialog = () => (
    <div id='account_closure_warning' className='account-closure-dialog lightbox'>
        <div id='account_closure_warning_content' className='account-closure-dialog-content gr-padding-10 gr-gutter'>
            <div className='center-text gr-padding-10'>
                <img
                    id='ic-emergency'
                    className='responsive'
                    src={it.url_for('images/pages/account_closure/ic-emergency.svg')}
                />
                <h1 className='gr-padding-10'>{it.L('Deactivate account?')}</h1>
                <p className='gr-12'>{it.L('Deactivating your account will automatically log you out. You can reactivate your account by logging in at any time.')}</p>
            </div>
            <div className='center-text gr-centered gr-padding-10 gr-child'>
                <a className='modal-back back button button-secondary' href='javascript:;'><span id='span-btn'>{it.L('Back')}</span></a>
                <button id='deactivate' className='button btn-size' type='submit'>{it.L('Deactivate')}</button>
            </div>
        </div>
    </div>
);

const AccountClosureError = () => (
    <div id='account_closure_error' className='account-closure-dialog lightbox'>
        <div id='account_closure_error_content' className='account-closure-dialog-content gr-padding-10 gr-gutter'>
            <div className='gr-padding-10 gr-parent'>
                <h3 className='secondary-color'>{it.L('Action required')}</h3>
                <div className='gr-padding-20 gr-parent invisible' id='account_closure_open'>
                    {it.L('You have open positions in these Binary accounts:')}
                </div>
                <div className='gr-padding-20 gr-parent invisible' id='account_closure_balance'>
                    {it.L('You have funds in these Binary accounts:')}
                </div>
                <div className='gr-padding-20 gr-parent invisible' id='account_closure_open_mt'>
                    {it.L('You have open positions in these MT5 accounts:')}
                </div>
                <div className='gr-padding-20 gr-parent invisible' id='account_closure_balance_mt'>
                    {it.L('You have funds in these MT5 accounts:')}
                </div>
                <div className='gr-padding-20 gr-parent invisible' id='account_closure_pending_withdrawals'>
                    {it.L('You have pending withdrawal(s) in these Binary accounts:')}
                </div>
            </div>
            <div id='account_closure_error_buttons' className='gr-padding-10 gr-child'>
                <button className='modal-back back button no-margin'>{it.L('OK')}</button>
            </div>
        </div>
    </div>
);

const AccountClosure = () => (
    <React.Fragment>
        <div className='invisible' id='closure_loading'>
            <Loading />
        </div>
        <div id='logged_out' className='invisible'>
            <h1>{it.L('Deactivate Account')}</h1>
        </div>

        <div id='closure_container' className='account-closure'>
            <div id='step_1' className='invisible'>
                <h1 id='heading'>{it.L('Deactivate Account')}</h1>
                <p className='account-closure-subtitle'>{it.L('Before you deactivate your account, you need to do the following:')}</p>

                <div className='gr-no-gutter'>
                    <div id='closing_steps' className='gr-padding-10'>
                        <div className='gr-padding-10'>
                            <h3 className='secondary-color'>{it.L('Close open positions')}</h3>
                            <p className='no-margin'>{it.L('If you have a Binary real account, go to [_1]Portfolio[_2] to close any open positions.', `<a href="${it.url_for('user/portfoliows')}">`, '</a>')}</p>
                            <p className='invisible metatrader-link no-margin'>{it.L('If you have a MT5 real account, log into it to close any open positions.')}</p>
                        </div>
                        <div className='gr-padding-30'>
                            <h3 className='secondary-color'>{it.L('Withdraw your funds')}</h3>
                            <p className='no-margin'>{it.L('If you have a Binary real account, go to [_1]Cashier[_2] to withdraw your funds', `<a href="${it.url_for('cashier')}">`, '</a>')}</p>
                            <p className='invisible metatrader-link no-margin'>{it.L('If you have a MT5 real account, go to [_1]MT5 dashboard[_2] to withdraw your funds.', `<a href="${it.url_for('user/metatrader')}">`, '</a>')}</p>
                        </div>
                    </div>

                    <form id='form_closure_step_1' className='gr-padding-30'>
                        <SubmitButton
                            text={it.L('Continue to account deactivation')}
                            is_left_align
                            type='submit'
                        />
                    </form>
                </div>
            </div>

            <div id='step_2' className='invisible'>
                <h1 id='heading'>{it.L('Deactivate Account')}</h1>
                <strong className='account-closure-subtitle'>{it.L('Please tell us why you’re leaving. (Select up to 3 reasons.)')}</strong>

                <div className='gr-no-gutter'>
                    <form id='form_closure_step_2' className='gr-padding-20 account-closure-form'>
                        <div id='reason_list'>
                            {leaving_reason_list.map((item, index) => (
                                <div key={index}>
                                    <input name='reason-checkbox' type='checkbox' id={item.id} />
                                    <label htmlFor={item.id}>{item.title}</label>
                                </div>
                            ))}
                        </div>

                        <div className='textarea-container'>
                            <textarea type='text-area' id='other_trading_platforms' placeholder='If you don’t mind sharing, which other trading platforms do you use?' />
                            <textarea type='text-area' id='suggested_improves' maxLength='255' placeholder='What could we do to improve?' />
                        </div>

                        <p className='no-margin' id='remain_characters'>{it.L('Remaining characters: 250.')}</p>
                        <p className='no-margin'>{it.L('Must be numbers, letters, and special characters . , \' -')}</p>
                        <p className='no-margin errorfield invisible' id='remain_characters_warning' />
                        <p className='no-margin errorfield invisible' id='error_no_selection'>{it.L('Please select at least one reason.')}</p>

                        <div id='error_msg' />
                        <div className='gr-padding-10 gr-child margin-top-20'>
                            <a className='back button button-secondary' id='step_2_back' href='javascript:;'><span>{it.L('Back')}</span></a>
                            <a className='button button-disabled' id='step_2_submit' href='javascript:;'><span>{it.L('Continue')}</span></a>
                        </div>
                    </form>
                </div>
            </div>

            <div id='step_3' className='gr-gutter gr-padding-10 notice-msg-wrapper invisible'>
                <p className='notice-msg-text'>{it.L('We\'re sorry to see you leave.')}</p>
                <p className='notice-msg-text'>{it.L('Your account is now deactived.')}</p>
            </div>

            <div className='invisible' id='submit_loading'>
                <Loading />
            </div>
            <div id='dialog_container' className='invisible'>
                <AccountClosureDialog />
                <AccountClosureError />
            </div>
        </div>
    </React.Fragment>
);

export default AccountClosure;
