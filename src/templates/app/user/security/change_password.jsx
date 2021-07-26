import React from 'react';
import { FormRow, Fieldset } from '../../../_common/components/forms.jsx';
import Loading from '../../../_common/components/loading.jsx';

const AppsList = ({ platform }) => {
    if (platform === 'binary') {
        return (
            <React.Fragment>
                <div className='binary-app'>Binary.com</div>
                <div className='app-list'>
                    <span>SmartTrader</span>
                    <span>Binary Bot</span>
                    <span>WebTrader</span>
                </div>
            </React.Fragment>
        );
    }
    return (
        <div className='app-list'>
            <span>MT5</span>
        </div>
    );
};

const ChangePassword = () => (
    <React.Fragment>
        <h1>{it.L('Change Password')}</h1>
        <div className='invisible' id='change_password_loading'>
            <Loading />
        </div>
        <div id='change_password_container' className='change_password invisible'>
            <form className='form gr-padding-10' id='frm_change_password'>
                <Fieldset legend={it.L('Binary Password')}>
                    <p className='hint'>{it.L('Use this to log in to Binary.com, SmartTrader, Binary Bot, and Webtrader.')}</p>
                    <div className='gr-gutter gr-padding-20'>
                        <div className='gr-row clear' id='binary_password_content_wrapper'>
                            <div id='binary_password_container' className='row-inner gr-7 gr-12-p gr-12-m align-self-center invisible'>
                                <div className='align-start'>
                                    <FormRow autoComplete='current-password' type='password' id='old_password' label={it.L('Current password')} />
                                    <FormRow
                                        autoComplete='new-password'
                                        has_password_meter
                                        type='password'
                                        id='new_password'
                                        label={it.L('New password')}
                                    />
                                    <div className='gr-row gr-padding-10'>
                                        <a
                                            id='forgot_binary_pw_btn'
                                            className='button-secondary gr-6 gr-12-p gr-12-m gr-gutter center-text-m align-end'
                                            href='javascript:;'
                                        >
                                            <span>{it.L('Forgot password')}</span>
                                        </a>
                                        <div className='gr-6 gr-12-p gr-12-m gr-gutter center-text-m'>
                                            <button
                                                id='change_binary_pw_btn'
                                                className='button'
                                                type='submit'
                                            >
                                                {it.L('Change password')}
                                            </button>
                                        </div>
                                        <p
                                            id='frm_change_binary_password_error'
                                            className='error-msg no-margin gr-gutter invisible'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div id='social_signup_container' className='row-inner gr-7 gr-12-p gr-12-m align-self-center invisible'>
                                <div id='social-identifier' className='social-identifier gr-padding-10 flex center-align flex-row'>
                                    <img id='ic_linked_social_identifier' />
                                    <span id='linked_social_identifier' />
                                    <a
                                        id='social_unlink_button'
                                        style={{ display: 'inline-block', marginBottom: '0' }}
                                        className='button'
                                        msg_id='frm_unlink_social_account_error'
                                        href='javascript:;'
                                    >
                                        <span>{it.L('Unlink')}</span>
                                    </a>
                                </div>
                            </div>
                            <div className='gr-5 gr-12-p gr-12-m'>
                                <p className='hint'>{it.L('Apps you have linked to this password:')}</p>
                                <AppsList platform='binary' />
                            </div>
                        </div>
                        <ul id='msg_success_container' className='gr-padding-10 checked invisible'>
                            <li id='msg_success' />
                        </ul>
                    </div>
                </Fieldset>
            </form>
            <form className='form gr-padding-10' id='frm_trading_password'>
                <Fieldset legend={it.L('Trading password')}>
                    <p className='hint'>{it.L('Use this to log in and trade with MT5.')}</p>
                    <div className='gr-gutter gr-padding-20'>
                        <div className='gr-row clear' id='trading_password_content_wrapper'>
                            <div id='trading_password_container' className='row-inner gr-7 gr-12-p gr-12-m align-self-center invisible'>
                                <div className='align-start'>
                                    <FormRow autoComplete='current-password' type='password' id='old_trading_password' label={it.L('Current password')} />
                                    <FormRow
                                        autoComplete='new-password'
                                        has_password_meter
                                        type='password'
                                        id='new_trading_password'
                                        label={it.L('New password')}
                                    />
                                    <div className='gr-row gr-padding-10'>
                                        <a
                                            id='forgot_trading_pw_btn'
                                            className='button-secondary gr-6 gr-12-p gr-12-m gr-gutter center-text-m align-end'
                                            href='javascript:;'
                                        >
                                            <span>{it.L('Forgot password')}</span>
                                        </a>
                                        <div className='gr-6 gr-12-p gr-12-m gr-gutter center-text-m'>
                                            <button
                                                id='change_trading_pw_btn'
                                                className='button'
                                                msg_id='frm_change_trading_password_error'
                                                type='submit'
                                            >
                                                {it.L('Change password')}
                                            </button>
                                        </div>
                                        <p
                                            id='frm_change_trading_password_error'
                                            className='error-msg no-margin gr-gutter invisible'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div id='set_trading_password_container' className='row-inner gr-7 gr-12-p gr-12-m align-self-center invisible'>
                                <div className='align-start'>
                                    <FormRow
                                        autoComplete='set_trading-password'
                                        has_password_meter
                                        type='password'
                                        id='set_new_trading_password'
                                        label={it.L('Trading password')}
                                    />
                                    <div className='gr-row gr-padding-10'>
                                        <div className='gr-4 gr-0-p gr-0-m'>&nbsp;</div>
                                        <div className='gr-6 gr-12-p gr-12-m gr-gutter center-text-m'>
                                            <button
                                                id='set_trading_btn'
                                                className='button'
                                                msg_id='frm_set_trading_password_error'
                                                type='submit'
                                            >
                                                {it.L('Set trading password')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='gr-5 gr-12-p gr-12-m'>
                                <p className='hint'>{it.L('Apps you have linked to this password:')}</p>
                                <AppsList platform='trading' />
                            </div>
                        </div>
                        <ul id='msg_success_trading_container' className='gr-padding-10 checked invisible'>
                            <li id='msg_success_trading' />
                        </ul>
                    </div>
                </Fieldset>
            </form>
        </div>
    </React.Fragment>
);

export default ChangePassword;
