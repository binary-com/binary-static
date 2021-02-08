import React      from 'react';
import { Button } from '../../_common/components/elements.jsx';
import {
    FormRow,
    SubmitButton,
}                 from '../../_common/components/forms.jsx';
import Loading    from '../../_common/components/loading.jsx';
import MT5Banner  from '../../_common/components/mt5_banner.jsx';

/* eslint-disable react/jsx-no-target-blank */

const ResetPasswordButton = ({ id, secondary, full_width, text = it.L('Reset password') }) => {
    let class_string = `button reset-password${full_width ? 'full-width' : ''}`;
    class_string += (secondary ? ' button-secondary' : '');

    return (
        <a
            className={class_string}
            href='javascript:;'
            id={id}
        >
            <span className='button'>{text}</span>
        </a>
    );
};

const AccountDesc = ({ title, description, account_type, landing_company_short, items, id = undefined }) => {
    let types = '';
    if (account_type) {
        types = `demo_${account_type} real_${account_type} ${landing_company_short || ''}`;
    }

    return (
        <div className={types} id={id}>
            <h3>{title}</h3>
            <p>{description}</p>
            <ul className='checked small no-padding'>
                {items && items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
            <p>
                <a className='button' href={it.url_for('metatrader/types-of-accounts')} target='_blank'>
                    <span>{it.L('Compare MetaTrader 5 accounts')}</span>
                </a>
            </p>
        </div>
    );
};

const TypeGroup = ({ title, children, types }) => (
    <div className='type-group gr-row'>
        <div className='gr-12 gr-padding-20 gr-parent'>
            <h3>{title}</h3>
            {children}
        </div>
        {types.map((box, i) => (
            <div
                key={i}
                className={`${box.title ? 'gr-6' : 'gr-3 gr-6-p gr-6-m gr-centered'}${/template_(demo|real)/.test(box.type) ? ` invisible ${box.type}` : ''}`}
            >
                <div id={box.id || `rbtn_${box.type}`} className='mt5_type_box' data-acc-type={box.type}>
                    {box.title ?
                        <div>{box.title}</div>
                        :
                        <img src={it.url_for(`images/pages/metatrader/icons/acc_${box.desc.toLowerCase()}.svg`)} />
                    }
                </div>
                <p className={`gr-padding-10 ${box.title ? 'hint' : ''}`}>{box.desc}</p>
            </div>
        ))}
    </div>
);

const CashierDesc = ({ title, desc, arrow_direction }) => (
    <div className='center-text hint gr-padding-20 gr-parent'>
        <h3 className='secondary-color'>{title}</h3>
        <p>{desc}</p>
        <div className='vertical-center gr-padding-10'>
            <img src={it.url_for('images/pages/metatrader/dashboard/binary_wallet.svg')} />
            <img src={it.url_for(`images/pages/metatrader/dashboard/arrow_${arrow_direction}.svg`)} className='gr-gutter' />
            <img src={it.url_for('images/pages/metatrader/dashboard/mt5_wallet.svg')} />
        </div>
    </div>
);

const Metatrader = () => (
    <React.Fragment>
        <MT5Banner />
        <div className='static_full'>
            <h1>{it.L('MetaTrader 5 dashboard')}</h1>
        </div>
        <p id='page_msg' className='notice-msg center-text invisible' />
        <p id='financial_authenticate_msg' className='notice-msg center-text invisible'>
            {it.L('Please [_1]authenticate[_2] your account to continue trading.', `<a href="${it.url_for('user/authenticate')}">`, '</a>')}
        </p>
        <div id='mt_loading'><Loading /></div>
        <div id='mt_account_management' className='gr-row invisible'>
            <div id='mt_left_panel' className='gr-9 gr-12-t gr-12-p gr-12-m gr-no-gutter gr-gutter-right gr-no-gutter-p gr-no-gutter-m'>
                <div id='account_details' className='mt-panel mt-container'>
                    <div className='gr-row'>
                        <div className='gr-9 gr-12-m gr-12-p'>
                            <div className='gr-row'>
                                <div className='gr-grow'>
                                    <div id='account_selector'>
                                        <h4 id='mt5_account' />
                                        <div id='accounts_list'>
                                            <div className='list' />
                                        </div>
                                    </div>
                                </div>
                                <div className='gr-grow'>
                                    <a className='button button-secondary act_new_account' href='javascript:;'>
                                        <span id='new_account_icon'>{it.L('New account')}</span>
                                    </a>
                                </div>
                            </div>
                            <div className='acc-info has-account invisible'>
                                <div className='gr-row gr-padding-10'>
                                    <div className='gr-3'>{it.L('MT5 Login:')}</div>
                                    <div data='display_login' />
                                    <div className='display_login_tip'>&#9432;</div>
                                </div>
                                <div className='gr-row gr-padding-10 gr-parent'>
                                    <div className='gr-3'>{it.L('Name:')}</div>
                                    <div data='name' />
                                </div>
                                <div className='gr-row gr-padding-10 gr-parent gr-hide mobile-balance'>
                                    <div className='gr-3'>{it.L('Balance:')}</div>
                                    <div data='balance' />
                                </div>
                                <div className='gr-row gr-padding-10 gr-parent'>
                                    <div className='gr-3'>{it.L('Broker:')}</div>
                                    <div data='broker' />
                                </div>
                                <div className='gr-row gr-padding-10 gr-parent'>
                                    <div className='gr-3'>{it.L('Server:')}</div>
                                    <div data='server' />
                                </div>
                                <div id='mt-trade-server-container' className='gr-row gr-padding-10 gr-parent invisible'>
                                    <div className='gr-3'>{it.L('Trade server:')}</div>
                                    <div className='mt-trade-server' data='trade_server' />
                                </div>
                            </div>
                        </div>
                        <div className='gr-3 align-end gr-hide-m gr-hide-p'>
                            <div className='acc-info has-account invisible'>
                                <div>{it.L('Balance')}</div>
                                <div className='balance gr-padding-10' data='balance' />
                            </div>
                        </div>
                        <div className='add_more_servers'>
                            <a id='btn_add_more_servers' className='button' href='javascript:;'>
                                <span>{it.L('Add more trade servers')}</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className='hint gr-padding-20 gr-parent no-margin'>
                    <p className='no-margin'>
                        {it.L('Server maintenance starting 03:00 GMT every Sunday. This process may take up to 2 hours to complete. Service may be disrupted during this time.')}
                    </p>
                </div>
                <div className='mt-panel'>
                    <div className='acc-actions'>
                        <a href='javascript:;' className='act_new_account new-account center-text invisible'>
                            <span>{it.L('Create MetaTrader 5 account')}</span>
                        </a>
                        <a href='javascript:;' className='act_cashier has-account center-text invisible'>
                            <span>{it.L('Manage funds')}</span>
                        </a>
                        <a href='javascript:;' className='act_manage_password has-account center-text invisible'>
                            <span>{it.L('Manage MT5 password')}</span>
                        </a>
                    </div>
                    <div className='fst-container mt-container'>
                        <div id='fst_action' className='invisible'>
                            <p id='main_msg' className='notice-msg center-text invisible' />
                            <div id='frm_action' className='invisible' />
                        </div>
                    </div>
                </div>
            </div>
            <div id='mt_right_panel' className='gr-3 gr-12-t gr-12-p gr-12-m gr-no-gutter gr-gutter-left gr-no-gutter-p gr-no-gutter-m'>
                <a href={`${it.url_for('get-started')}?get_started_tabs=mt5`} className='get-started-link'>{it.L('Get started with MT5')}</a>
                <div className='mt-panel'>
                    <div id='account_desc' className='mt-container border-bottom' />
                </div>
                <div className='mt-panel'>
                    <div className='mt-sidebar-button border-bottom'>
                        <div className='small-icon'>
                            <a href={it.url_for('metatrader/download')}>
                                <img src={it.url_for('images/pages/metatrader/dashboard/mt5.png')} />
                            </a>
                        </div>
                        <div className='mt-link-download'>
                            <a href={it.url_for('metatrader/download')} className='mt-link-button'>
                                {it.L('Go to MT5 download page')}
                            </a>
                        </div>
                    </div>
                </div>
                <div className='mt-panel'>
                    <div className='mt-sidebar-button mt5-web'>
                        <div className='small-icon'>
                            <a href='https://trade.mql5.com/trade?servers=Deriv-Server&trade_server=Deriv-Server' target='_blank' rel='noopener noreferrer'>
                                <img src={it.url_for('images/pages/metatrader/dashboard/img-app-mac@2x.png')} />
                            </a>
                        </div>
                        <div className='mt-title-mt5-web'>
                            {it.L('MT5 Web platform')}
                        </div>
                        <div className='mt-link-web'>
                            <div className='mt5-web-link'>
                                <a href='https://trade.mql5.com/trade?servers=Deriv-Demo&trade_server=Deriv-Demo' target='_blank' rel='noopener noreferrer'>
                                    {it.L('Demo')}
                                </a>
                            </div>
                            <div className='mt5-web-link'>
                                <a href='https://trade.mql5.com/trade?servers=Deriv-Server&trade_server=Deriv-Server' target='_blank' rel='noopener noreferrer'>
                                    {it.L('Real')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id='templates' className='invisible'>
                <div className='acc-name invisible'>
                    <div className='mt-icon'>
                        <img src={it.url_for('images/pages/metatrader/dashboard/account.svg')} />
                    </div>
                    <div className='mt-balance invisible'>&nbsp;</div>
                    <span className='mt-type' />
                    <span className='mt-login' />
                    <span className='mt-server mt-trade-server' />
                </div>
                <div className='account-desc'>
                    <AccountDesc
                        id='general_desc'
                        title={it.L('Choose an account')}
                        description={it.L('[_1] offers a variety of account types to cater to the diverse needs of traders everywhere, whether you\'re an experienced trader or just starting out.', it.website_name)}
                    />
                    {/* first item should be the general description
                        if there are any landing company specific descriptions,
                        they should be below this with landing_company_short prop */}
                    <AccountDesc
                        account_type={'financial_financial'}
                        title={it.L('Financial Account')}
                        description={it.L('Our MetaTrader 5 Financial account is suitable for both new and experienced traders.')}
                        items={[
                            it.L('Leverage up to [_1]', '1:1000'),
                            it.L('Variable spreads'),
                            it.L('Market execution'),
                            it.L('No commission'),
                        ]}
                    />
                    <AccountDesc
                        account_type={'financial_financial'}
                        landing_company_short='maltainvest'
                        title={it.L('Financial Account')}
                        description={it.L('Our MetaTrader 5 Financial account is suitable for both new and experienced traders.')}
                        items={[
                            it.L('Leverage up to [_1]', '1:30'),
                            it.L('Variable spreads'),
                            it.L('Market execution'),
                            it.L('No commission'),
                            it.L('Negative balance protection'),
                        ]}
                    />

                    <AccountDesc
                        account_type={'financial_financial_stp'}
                        title={it.L('Financial STP Account')}
                        description={it.L('Our MetaTrader 5 Financial STP account provides you with tight spreads, higher ticket size and offers more products.')}
                        items={[
                            it.L('Leverage up to [_1]', '1:100'),
                            it.L('Variable spreads'),
                            it.L('Market execution'),
                            it.L('No commission'),
                        ]}
                    />

                    <AccountDesc
                        account_type={'gaming_financial'}
                        title={it.L('Synthetic Account')}
                        description={it.L('Our Synthetic account allows you to trade CFDs on Synthetic Indices - our proprietary synthetic assets that simulate market forces.')}
                        items={[
                            it.L('Leverage up to [_1]', '1:1000'),
                            it.L('Fixed spreads'),
                            it.L('Market execution'),
                            it.L('No commission'),
                        ]}
                    />
                </div>
                <div id='frm_new_accounts'>
                    <form id='frm_new_account'>
                        <div id='mv_new_account'>
                            <div id='view_1' className='center-text'>
                                <div className='step-1'>
                                    <TypeGroup
                                        title={it.L('Step 1: Choose demo or real account')}
                                        types={[
                                            { type: 'demo', id: 'rbtn_demo', title: it.L('Demo'), desc: it.L('Practise your trading strategy with virtual funds in a risk-free environment.') },
                                            { type: 'real', id: 'rbtn_real', title: it.L('Real'), desc: it.L('Trade with real funds and access to competitive trading conditions.') },
                                        ]}
                                    />
                                </div>
                                <div className='step-2 invisible'>
                                    <div className='separator-line gr-padding-10' />
                                    <TypeGroup
                                        title={it.L('Step 2: Choose account type')}
                                        types={[
                                            { type: 'template_demo', desc: 'financial' },
                                            { type: 'template_real', desc: 'financial' },
                                        ]}
                                    >
                                        <a className='hint hl-types-of-accounts' href={it.url_for('metatrader/types-of-accounts')} target='_blank'>{it.L('Which account is right for me?')}</a>
                                    </TypeGroup>
                                </div>
                                <div id='authenticate_loading' className='invisible'><Loading /></div>

                                <p id='new_account_msg' className='notice-msg center-text invisible' />
                                <div className='center-text'>
                                    <a className='button button-secondary btn-cancel' href='javascript:;'>
                                        <span>{it.L('Cancel')}</span>
                                    </a>
                                    <a className='button button-disabled btn-next' href='javascript:;'>
                                        <span>{it.L('Next')}</span>
                                    </a>
                                </div>
                            </div>
                            <div id='view_password' className='invisible'>
                                <div id='view_password-confirm' className='gr-row'>
                                    <div className='container'>
                                        <div className='notice-msg universal-password-alert'>
                                            {it.L('Please confirm your [_1] password to create an MT5 account. If you’ve forgotten your password, click Reset password.', it.website_name)}
                                        </div>
                                    </div>
                                    <div className='container gr-8 gr-12-m'>
                                        <input type='hidden' id='txt_name' />
                                        <div className='confirm-password-form-fields'>
                                            <label htmlFor='txt_main_pass'>
                                                {it.L('Password')}
                                            </label>
                                            <br />
                                            <input className='full-width' type='password' id='txt_main_pass'  />
                                        </div>
                                    </div>
                                    <div className='container gr-12'>
                                        <div id='view_password-buttons' className='full-width gr-padding-10 center-text'>
                                            <a
                                                className='button button-secondary btn-cancel invisible'
                                                href='javascript:;'
                                            >
                                                <span className='button'>{it.L('Cancel')}</span>
                                            </a>
                                            <ResetPasswordButton secondary />
                                            <a className='button btn-next invisible' href='javascript:;'>
                                                <span>{it.L('Next')}</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div id='view_password-reset'>
                                    <div className='gr-row'>
                                        <div className='container gr-8 gr-12-m'>
                                            <h1 className='center-text'>{it.L('All you’ll need from now is one password')}</h1>
                                        </div>
                                        <div className='container gr-8 gr-12-m'>
                                            <p>{it.L('We’ve upgraded our system to support a single, more secure password across [_1]. Once you’ve set a new password, you can use it to log into all your [_1] and MT5 accounts.', it.website_name)}</p>
                                        </div>
                                        <div className='container gr-8 gr-12-m center-text'>
                                            <ResetPasswordButton />
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div id='view_trading_server' className='gr-row invisible'>
                                <div id='server_unavailable_notice' className='notice-msg center-text invisible'>
                                    {it.L('Due to an issue on our server, some MT5 accounts are unavailable at the moment. Please bear with us and thank you for your patience.')}
                                </div>
                                <div className='container gr-8 gr-12-m'>
                                    <p>{it.L('Choose a server for your MT5 [_1] account:', '<span id="mt5_account_type"></span>')}</p>
                                    <div id='ddl_trade_server' type='radio' />
                                    <div id='view_trading_server-buttons' className='gr-padding-10 center-text'>
                                        <a className='button button-secondary btn-back' href='javascript:;'>
                                            <span>{it.L('Back')}</span>
                                        </a>
                                        <a
                                            className='button button-secondary btn-cancel invisible'
                                            href='javascript:;'
                                        >
                                            <span className='button'>{it.L('Cancel')}</span>
                                        </a>
                                        <a className='button btn-next invisible' href='javascript:;'>
                                            <span>{it.L('Next')}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div id='view_password_reset' className='gr-row invisible'>
                                <div className='container gr-8 gr-12-m center-text'>
                                    <h2>{it.L('Too many failed attempts')}</h2>
                                    <p className='center-text'>{it.L('Unavailable because of too many failed attempts. Please try again in a minute or reset your account password to continue.')}</p>
                                    <a className='button button-secondary btn-back' href='javascript:location.reload()'>
                                        <span>{it.L('Cancel')}</span>
                                    </a>
                                    <ResetPasswordButton />
                                </div>
                            </div>
                            <div id='view_check-main' className='gr-row invisible'>
                                <div className='container gr-8 gr-12-m center-text'>
                                    <h2 className='center-text'>{it.L('Reset password')}</h2>
                                    <p className='notice-msg'>
                                        {it.L('Please check your email for further instructions.')}
                                    </p>
                                </div>
                            </div>
                            <button id='btn_submit_new_account' className='invisible' type='submit' action='new_account'>
                                {it.L('Create account')}
                            </button>
                        </div>
                    </form>
                </div>
                <div id='frm_manage_password'>
                    <div className='gr-row'>
                        <div className='gr-6 gr-12-m flex'>
                            <div className='mt-panel mt-container'>
                                <div id='frm_verify_password_reset' className='invisible'>
                                    <div className='center-text hint gr-padding-20 gr-parent'>
                                        <h3 className='secondary-color'>{it.L('Change main password')}</h3>
                                    </div>
                                    <div className='container notice-msg universal-password-alert'>
                                        <span id='txt_change_main_password_existing_users' className='invisible'>{it.L('We’ve upgraded our system to support a single, more secure password across all of [_1]. Once you’ve set a new password, you can use it to log into all your [_1], and MT5 accounts.', it.website_name)}</span>
                                        <span id='txt_change_main_password_new_users' className='invisible'>{it.L('Your MT5 password is now same as your [_1] account. To reset, please go to [_2]Settings[_3] to change your password.', it.website_name, '<strong>', '</strong >')}</span>
                                    </div>
                                    <ResetPasswordButton
                                        id='main_reset_password'
                                        full_width
                                        className='invisible'
                                        text={it.L('Reset account password')}
                                    />
                                    <a
                                        rel='noreferrer'
                                        href={it.url_for('/user/security/change_passwordws')}
                                        id='btn_go_to_setting'
                                        className='full-width button invisible no-margin'
                                    >
                                        <span className='button'>{it.L('Go to settings')}</span>
                                    </a>
                                </div>
                                <div className='invisible' id='frm_check_mail_instruction'>
                                    <div className='center-text hint gr-padding-20 gr-parent'>
                                        <h3 className='secondary-color'>{it.L('Reset password')}</h3>
                                    </div>
                                    <div className='container notice-msg universal-password-alert'>
                                        {it.L('Please check your email for further instructions.')}
                                    </div>
                                    <p className='font-s'>{it.L('If you don’t receive the email within the next few minutes, please check your junk/spam folder.')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='gr-6 gr-12-m flex'>
                            <div className='mt-panel mt-container'>
                                <form id='frm_password_change'>
                                    <div className='center-text hint gr-padding-20 gr-parent'>
                                        <h3 className='secondary-color'>{it.L('Change investor password')}</h3>
                                    </div>
                                    <p className='center-text notice-msg no-margin invisible' id='token_error'>{it.L('Verification code is wrong. Please use the link sent to your email, or request a new token by clicking Reset investor password.')}</p>
                                    <FormRow
                                        is_two_rows
                                        type='password'
                                        id='txt_old_password'
                                        label={it.L('Confirm current password')}
                                    />
                                    <FormRow
                                        is_two_rows
                                        type='password'
                                        id='txt_new_password'
                                        label={it.L('New investor password')}
                                        hint={it.L('Minimum of eight lower and uppercase English letters with numbers')}
                                    />
                                    <FormRow
                                        is_two_rows
                                        type='password'
                                        id='txt_re_new_password'
                                        label={it.L('Verify new investor password')}
                                    />
                                    <SubmitButton
                                        is_centered
                                        type='submit'
                                        id='btn_submit_password_change'
                                        text={it.L('Change investor password')}
                                        attributes={{ action: 'password_change' }}
                                    />
                                    <div className='center-text'>
                                        <a
                                            href='javascript:;'
                                            id='btn_reset_investor_password'
                                            className='btn-reset-investor-password'
                                        >
                                            {it.L('Reset investor password')}
                                        </a>
                                    </div>
                                </form>
                                <form className='invisible' id='frm_password_reset'>
                                    <input type='hidden' id='reset_password_type' name='password_type' value='investor' />
                                    <FormRow is_two_rows type='password' id='txt_reset_new_password' label={it.L('New investor password')} hint={it.L('Minimum of eight lower and uppercase English letters with numbers')} />
                                    <FormRow is_two_rows type='password' id='txt_reset_re_new_password' label={it.L('Verify new investor password')} />
                                    <SubmitButton
                                        no_wrapper
                                        type='submit'
                                        id='btn_submit_password_reset'
                                        text={it.L('Reset investor password')}
                                        attributes={{ action: 'password_reset' }}
                                    />
                                </form>
                                <form className='invisible' id='frm_verify_password_reset_token'>
                                    <div className='gr-padding-10'>
                                        <p className='no-margin'>{it.L('Please check your email for the verification code to complete the process.')}</p>
                                        <FormRow
                                            is_two_rows
                                            type='text'
                                            label={it.L('Verification code')}
                                            id='txt_verification_code'
                                            attributes={{ autoComplete: 'off' }}
                                        />
                                        <SubmitButton
                                            no_wrapper
                                            type='submit'
                                            id='btn_submit_verify_password_reset_token'
                                            text={it.L('Submit')}
                                            attributes={{ action: 'verify_password_reset_token' }}
                                        />
                                    </div>
                                </form>
                                <div className='invisible' id='frm_investor_check_mail'>
                                    <div className='center-text hint gr-padding-20 gr-parent'>
                                        <h3 className='secondary-color'>{it.L('Reset investor password')}</h3>
                                    </div>
                                    <div className='container notice-msg universal-password-alert'>
                                        {it.L('Please check your email for further instructions.')}
                                    </div>
                                    <p className='font-s'>{it.L('If you don’t receive the email within the next few minutes, please check your junk/spam folder.')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='frm_cashier'>
                    <div className='gr-row gr-row-align-center demo-only invisible'>
                        <Loading id={'demo_topup_loading'} />
                        <p id={'demo_topup_info'} className='gr-12 gr-12-m center-text' />
                        <Button id={'demo_topup_btn'} />
                    </div>
                    <div className='real-only invisible'>
                        <div className='gr-padding-20 gr-parent'>
                            <div className='fill-bg-color center-text mt-container'>
                                <div className='gr-10 gr-push-1 gr-12-m gr-push-0-m'>
                                    <h3 className='secondary-color'>{it.L('How to manage your funds')}</h3>
                                    <p className='hint'>{it.L('Deposits and withdrawals for your MetaTrader 5 account always pass through your binary options account.')}</p>
                                    <div className='gr-row'>
                                        <div className='gr-5 gr-no-gutter-m'>
                                            <img
                                                src={it.url_for('images/pages/metatrader/dashboard/binary_wallet.svg')}
                                            />
                                            <div className='binary-account gr-padding-10' />
                                            <div className='binary-balance gr-padding-10 gr-parent' />
                                            <a
                                                className='secondary-color hint'
                                                href={it.url_for('cashier')}
                                            >{it.L('Add funds')}
                                            </a>
                                        </div>
                                        <div className='gr-2 gr-padding-20 gr-no-gutter-m'>
                                            <img src={it.url_for('images/pages/metatrader/dashboard/transfer.svg')} />
                                        </div>
                                        <div className='gr-5 gr-no-gutter-m gr-gutter-left-m'>
                                            <img src={it.url_for('images/pages/metatrader/dashboard/mt5_wallet.svg')} />
                                            <div className='mt5-account gr-padding-10' />
                                            <div className='mt5-balance gr-padding-10 gr-parent' />
                                            <div className='hint'>{it.L('Deposit or withdraw below')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className='gr-padding-20 gr-parent no-margin hint center-text invisible'
                            id='mt5_remaining_transfers'
                        >
                            {it.L('Remaining MT5 fund transfers for today: [_1]', '<strong />')}
                        </div>
                        <div className='gr-row'>
                            <div className='gr-6 gr-12-m flex'>
                                <div className='mt-panel mt-container'>
                                    <form id='frm_deposit'>
                                        <CashierDesc
                                            title={it.L('Transfer funds to your MT5 account')}
                                            arrow_direction='right'
                                            desc={it.L('Transfer funds from your binary options account into your MetaTrader 5 account.')}
                                        />

                                        <div className='form'>
                                            <FormRow
                                                is_two_rows
                                                type='text'
                                                id='txt_amount_deposit'
                                                label={it.L('Amount')}
                                                attributes={{ maxLength: 10 }}
                                                hint={it.L('Subject to [_1] transfer fee or [_2], whichever is higher', '<span id="transfer_fee_amount_to"></span>', '<span id="transfer_fee_minimum_to"></span>')}
                                            />
                                            <SubmitButton
                                                is_centered
                                                is_full_width
                                                type='submit'
                                                id='btn_submit_deposit'
                                                text={it.L('Transfer to MT5')}
                                                attributes={{ action: 'deposit' }}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className='gr-6 gr-12-m flex'>
                                <div className='mt-panel mt-container'>
                                    <form id='frm_withdrawal'>
                                        <CashierDesc
                                            title={it.L('Withdraw funds from your MT5 account')}
                                            arrow_direction='left'
                                            desc={it.L('Transfer funds from your MetaTrader 5 account into your binary options account.')}
                                        />

                                        <div className='form'>
                                            <FormRow
                                                is_two_rows
                                                type='text'
                                                id='txt_amount_withdrawal'
                                                label={it.L('Amount')}
                                                attributes={{ maxLength: 10 }}
                                                hint={it.L('Subject to [_1] transfer fee or [_2], whichever is higher', '<span id="transfer_fee_amount_from"></span>', '<span id="transfer_fee_minimum_from"></span>')}
                                            />
                                            <SubmitButton
                                                is_centered
                                                is_full_width
                                                type='submit'
                                                id='btn_submit_withdrawal'
                                                text={it.L('Withdraw from MT5')}
                                                attributes={{ action: 'withdrawal' }}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='messages'>
                    <div
                        id='msg_set_currency'
                    >{it.L('To perform this action, please set the [_1]currency[_2] of your account.', `<a href="${it.url_for('user/set-currency')}">`, '</a>')}
                    </div>
                    <div id='msg_switch'>
                        {it.L('To perform this action, please switch to your [_1] Real Account.', it.website_name)}
                        <br />
                        {it.L('If you do not have a [_1] Real Account yet, please [_2]create one[_3].', it.website_name, `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                    </div>
                    <div id='msg_real_financial'>
                        <span
                            id='msg_metatrader_account'
                            className='invisible'
                        >{it.L('To create a MetaTrader 5 account:')}
                        </span>
                        <ul className='bullet'>
                            <li className='malta invisible'>{it.L('Upgrade to [_1] [_2]Gaming Account[_3].', it.website_name, `<a href="${it.url_for('user/accounts')}">`, '</a>')}</li>
                            <li className='maltainvest invisible'>{it.L('Upgrade to [_1] [_2]Financial Account[_3].', it.website_name, `<a href="${it.url_for('user/accounts')}">`, '</a>')}</li>
                            <li className='trading_experience invisible'>{it.L('Please [_1]complete the trading experience section[_2] in the financial assessment to open an MT5 account.', `<a href="${it.url_for('user/settings/assessmentws')}">`, '</a>')}</li>
                            <li className='assessment invisible'>{it.L('Please [_1]complete the financial assessment[_2] to open an MT5 account.', `<a href="${it.url_for('user/settings/assessmentws')}">`, '</a>')}</li>
                            <li className='tax invisible'>{it.L('Complete your [_1]Tax Information[_2].', `<a href="${it.url_for('user/settings/detailsws')}">`, '</a>')}</li>
                            <li className='citizen invisible'>{it.L('Select [_1]Citizenship[_2].', `<a href="${it.url_for('user/settings/detailsws')}">`, '</a>')}</li>
                            <li className='acc_opening_reason invisible'>{it.L('Select [_1]Account opening reason[_2].', `<a href="${it.url_for('user/settings/detailsws')}">`, '</a>')}</li>
                            <li className='authenticate invisible'>{it.L('Please [_1]authenticate your account[_2] before creating an MT5 account.', `<a href="${it.url_for('user/authenticate')}">`, '</a>')}</li>
                        </ul>
                    </div>
                    <div
                        id='msg_authenticate'
                    >{it.L('To withdraw from MetaTrader 5 Financial Account please [_1]Authenticate[_2] your Binary account.', `<a href="${it.url_for('user/authenticate')}">`, '</a>')}
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);
/* eslint-enable react/jsx-no-target-blank */

export default Metatrader;
