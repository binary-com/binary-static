import React from 'react';
import { Fieldset } from '../../../_common/components/forms.jsx';
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
                    <p className='hint'>{it.L('This password is for logging in to your Binary.com account.')}</p>
                    <div className='gr-gutter gr-padding-20'>
                        <div className='gr-row clear' id='binary_password_content_wrapper'>
                            <div id='binary_password_container' className='row-inner gr-7 gr-12-p gr-12-m align-self-center invisible'>
                                <div className='align-start'>
                                    <div className='gr-row gr-padding-10'>
                                        <a
                                            id='forgot_binary_pw_btn'
                                            className='button gr-12-p gr-gutter center-text-m'
                                            href='javascript:;'
                                        >
                                            <span>{it.L('Change password')}</span>
                                        </a>
                                        <p
                                            id='frm_change_binary_password_error'
                                            className='error-msg no-margin gr-gutter invisible'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div id='social_signup_container' className='row-inner gr-7 gr-12-p gr-12-m align-self-center invisible'>
                                <p id='linked_social_hint' className='hint' />
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
                <Fieldset legend={it.L('MT5 password')}>
                    <div className='gr-7 gr-12-p gr-12-m'>
                        <p className='hint'>{it.L('This password is for logging in to your MT5 accounts on the desktop, web, and mobile apps.')}</p>
                    </div>
                    <div className='gr-gutter gr-padding-20'>
                        <div className='gr-row clear' id='trading_password_content_wrapper'>
                            <div id='trading_password_container' className='row-inner gr-7 gr-12-p gr-12-m align-self-center invisible'>
                                <div className='align-start'>
                                    <div className='gr-row gr-padding-10'>
                                        <a
                                            id='forgot_trading_pw_btn'
                                            className='button gr-12-p gr-gutter center-text-m'
                                            href='javascript:;'
                                        >
                                            <span>{it.L('Change password')}</span>
                                        </a>
                                        <p
                                            id='frm_change_trading_password_error'
                                            className='error-msg no-margin gr-gutter invisible'
                                        />
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
