import React from 'react';
import Loading from '../../_common/components/loading.jsx';
import { FormRow, SubmitButton } from '../../_common/components/forms.jsx';

const AccountDesc = ({ title, description, account_type, items }) => {
    let types = '';
    if (account_type) {
        account_type.forEach((type) => {
            types += ` demo_${type} real_${type}`;
        });
    } else {
        types = 'new_account';
    }

    return (
        <div className={types}>
            <h3>{title}</h3>
            <p>{description}</p>
            <ul className='checked small no-padding'>
                { items && items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
            <p>
                <a className='hl-types-of-accounts' href={it.url_for('metatrader/types-of-accounts')} target='_blank'>{it.L('Compare MetaTrader 5 accounts')}</a>
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
        { types.map((box, i) => (
            <div key={i} className={box.title ? 'gr-6' : 'gr-3 gr-6-p gr-6-m gr-centered'}>
                <div id={box.id || `rbtn_${box.type}`} className='mt5_type_box' data-acc-type={box.type}>
                    {box.title ?
                        <div>{box.title}</div>
                        :
                        <img src={it.url_for(`images/pages/metatrader/icons/acc_${box.desc.toLowerCase()}.svg`)} />
                    }
                </div>
                <p className={`no-margin gr-padding-10 ${box.title ? 'hint' : ''}`}>{box.desc}</p>
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
        <div className='container'>
            <div className='static_full'>
                <h1>{it.L('MetaTrader 5 dashboard')}</h1>
            </div>
            <p id='page_msg' className='notice-msg center-text invisible' />
            <div id='mt_loading'><Loading /></div>
            <div id='mt_account_management' className='gr-row invisible'>
                <div id='mt_left_panel' className='gr-9 gr-12-t gr-12-p gr-12-m gr-no-gutter gr-gutter-right gr-no-gutter-p gr-no-gutter-m'>
                    <div id='account_details' className='mt-panel mt-container'>
                        <div className='gr-row'>
                            <div className='gr-grow'>
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
                                            <span id='new_account_icon'>{it.L('New Account')}</span>
                                        </a>
                                    </div>
                                </div>
                                <div className='acc-info has-account invisible'>
                                    <div className='gr-row gr-padding-10'>
                                        <div className='gr-3'>{it.L('MT5 Account:')}</div>
                                        <div className='gr-grow' data='login' />
                                    </div>
                                    <div className='gr-row'>
                                        <div className='gr-3'>{it.L('Name:')}</div>
                                        <div className='gr-grow' data='name' />
                                    </div>
                                    <div className='gr-row gr-padding-10 gr-hide mobile-balance'>
                                        <div className='gr-3'>{it.L('Balance:')}</div>
                                        <div className='gr-gutter' data='balance' />
                                    </div>
                                </div>
                            </div>
                            <div className='gr-adapt align-end gr-hide-m gr-hide-p'>
                                <div className='acc-info has-account invisible'>
                                    <div>{it.L('Balance')}</div>
                                    <div className='balance gr-padding-10' data='balance' />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-panel'>
                        <div className='acc-actions'>
                            <span className='new-account gr-gutter invisible'>
                                <span />
                            </span>
                            <a href='javascript:;' className='act_cashier has-account center-text invisible'>
                                <span>{it.L('Manage funds')}</span>
                            </a>
                            <a href='javascript:;' className='act_password_change has-account center-text invisible'>
                                <span>{it.L('Change MT5 password')}</span>
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
                    <div className='mt-panel'>
                        <div id='account_desc' className='mt-container border-bottom' />
                        <div className='mt-container'>
                            <p>{it.L('MT5 trading platform links:')}</p>
                            <ul className='platforms'>
                                <li>
                                    <img src={it.url_for('images/pages/metatrader/dashboard/web.svg')} />
                                    <a href='https://trade.mql5.com/trade?servers=Binary.com-Server&amp;trade_server=Binary.com-Server' rel='noopener noreferrer' target='_blank'>{it.L('Trade on MT5 web platform')}</a>
                                </li>
                                <li>
                                    <img src={it.url_for('images/pages/metatrader/dashboard/mac.svg')} />
                                    <a href='https://s3.amazonaws.com/binary-mt5/binary-mt5.dmg' download>{it.L('Download MT5 for Mac')}</a>
                                </li>
                                <li>
                                    <img src={it.url_for('images/pages/metatrader/dashboard/windows.svg')} />
                                    <a href='https://s3.amazonaws.com/binary-mt5/binarycom_mt5.exe' download>{it.L('Download MT5 for Windows')}</a>
                                </li>
                                <li>
                                    <img src={it.url_for('images/pages/metatrader/dashboard/linux.svg')} />
                                    <a href='https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux' rel='noopener noreferrer' target='_blank'>{it.L('Read instructions for Linux')}</a>
                                </li>
                                <p className='badges'>
                                    <a href='https://download.mql5.com/cdn/mobile/mt5/ios?server=Binary.com-Server' rel='noopener noreferrer' target='_blank'>
                                        <span className='app-store-badge' />
                                    </a>
                                    <a href='https://download.mql5.com/cdn/mobile/mt5/android?server=Binary.com-Server' rel='noopener noreferrer' target='_blank'>
                                        <span className='google-play-badge' />
                                    </a>
                                </p>
                            </ul>
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
                    </div>


                    <div className='account-desc'>
                        <AccountDesc
                            title={it.L('Choose an account')}
                            description={it.L('[_1] offers a variety of account types to cater to the diverse needs of traders everywhere, whether you’re an experienced trader or just starting out.', it.website_name)}
                        />
                        <AccountDesc
                            account_type={['vanuatu_standard']}
                            title={it.L('Standard Account')}
                            description={it.L('Our MetaTrader 5 Standard account is suitable for both new and experienced traders.')}
                            items={[
                                it.L('Leverage up to 1:500'),
                                it.L('Variable spreads'),
                                it.L('Market execution'),
                                it.L('No commission'),
                            ]}
                        />
                        <AccountDesc
                            account_type={['vanuatu_advanced']}
                            title={it.L('Advanced Account')}
                            description={it.L('Our MetaTrader 5 Advanced account provides you with tight spreads, higher ticket size and offers more products.')}
                            items={[
                                it.L('Leverage up to 1:100'),
                                it.L('Variable spreads'),
                                it.L('Market execution'),
                                it.L('No commission'),
                            ]}
                        />
                        <AccountDesc
                            account_type={['costarica', 'malta']}
                            title={it.L('Volatility Indices Account')}
                            description={it.L('Our Volatility Indices account allows you to trade CFDs on Volatility Indices -- our proprietary synthetic assets that simulate market forces.')}
                            items={[
                                it.L('Leverage up to 1:500'),
                                it.L('Fixed spreads'),
                                it.L('Market execution'),
                                it.L('No commission'),
                            ]}
                        />
                    </div>

                    <form id='frm_new_account'>
                        <div id='mv_new_account'>
                            <div id='view_1' className='center-text'>
                                <div className='step-1'>
                                    <TypeGroup
                                        title={it.L('Step 1: Choose demo or real account')}
                                        types={[
                                            { type: 'demo', id: 'rbtn_demo', title: it.L('Demo'), desc: it.L('Practise your trading strategy with [_1] of virtual funds in a risk-free environment.', '$10,000') },
                                            { type: 'real', id: 'rbtn_real', title: it.L('Real'), desc: it.L('Trade with real funds and access to competitive trading conditions.') },
                                        ]}
                                    />
                                </div>
                                <div className='step-2 invisible'>
                                    <div className='separator-line gr-padding-10' />
                                    <TypeGroup
                                        title={it.L('Step 2: Choose account type')}
                                        types={[
                                            { type: 'template', desc: 'standard' },
                                        ]}
                                    >
                                        <a className='hint hl-types-of-accounts' href={it.url_for('metatrader/types-of-accounts')} target='_blank'>{it.L('Which account is right for me?')}</a>
                                    </TypeGroup>
                                </div>
                                <p id='new_account_msg' className='notice-msg center-text invisible' />
                                <div className='center-text'>
                                    <a id='btn_cancel' className='button button-secondary' href='javascript:;'>
                                        <span>{it.L('Cancel')}</span>
                                    </a>
                                    <a id='btn_next' className='button button-disabled' href='javascript:;'>
                                        <span>{it.L('Next')}</span>
                                    </a>
                                </div>
                            </div>
                            <div id='view_2' className='gr-row invisible'>
                                <div className='gr-8 gr-12-m'>
                                    <FormRow is_two_rows type='text'     id='txt_name'          label={it.L('Name')} attributes={{ maxLength: 30, autoComplete: 'off' }} />
                                    <FormRow is_two_rows type='password' id='txt_main_pass'     label={it.L('Main password (trading access)')} hint={it.L('Minimum eight characters. Must contain numbers, and mix of upper and lower case letters.')} />
                                    <FormRow is_two_rows type='password' id='txt_re_main_pass'  label={it.L('Verify main password')} />
                                    <FormRow is_two_rows type='password' id='txt_investor_pass' label={it.L('Investor password (read-only access)')} />
                                    <SubmitButton
                                        no_wrapper
                                        type='submit'
                                        id='btn_submit_new_account'
                                        text={it.L('Create Account')}
                                        attributes={{ action: 'new_account' }}
                                        custom_btn_text={it.L('Back')}
                                        custom_btn_id='btn_back'
                                        custom_btn_class='button-secondary'
                                    />
                                </div>
                            </div>
                        </div>
                    </form>

                    <form id='frm_password_change'>
                        <div className='gr-row'>
                            <div className='gr-8 gr-12-m'>
                                <FormRow is_two_rows type='password' id='txt_old_password'    label={it.L('Current MT5 password')} />
                                <FormRow is_two_rows type='password' id='txt_new_password'    label={it.L('New MT5 password')} hint={it.L('Minimum eight characters. Must contain numbers, and mix of upper and lower case letters.')} />
                                <FormRow is_two_rows type='password' id='txt_re_new_password' label={it.L('Verify new MT5 password')} />
                                <SubmitButton
                                    no_wrapper
                                    type='submit'
                                    id='btn_submit_password_change'
                                    text={it.L('Change MT5 password')}
                                    attributes={{ action: 'password_change' }}
                                />
                            </div>
                        </div>
                    </form>

                    <div id='frm_cashier'>
                        <div className='gr-row demo-only invisible'>
                            <p className='gr-8 gr-push-2 gr-12-m gr-push-0-m gr-padding-30'>{it.L('This demo account comes with [_1] of virtual funds. Please [_2]contact our customer support team[_3] to replenish virtual funds if your account balance is empty.', '$10,000.00', `<a href="${it.url_for('contact')}">`, '</a>')}</p>
                        </div>
                        <div className='real-only invisible'>
                            <div className='gr-padding-20 gr-parent'>
                                <div className='fill-bg-color center-text mt-container'>
                                    <div className='gr-10 gr-push-1 gr-12-m gr-push-0-m'>
                                        <h3 className='secondary-color'>{it.L('How to manage your funds')}</h3>
                                        <p className='hint'>{it.L('Deposits and withdrawals for your MetaTrader 5 account always pass through your binary options account.')}</p>
                                        <div className='gr-row'>
                                            <div className='gr-5'>
                                                <img src={it.url_for('images/pages/metatrader/dashboard/binary_wallet.svg')} />
                                                <div className='binary-account gr-padding-10' />
                                                <div className='binary-balance gr-padding-10 gr-parent' />
                                                <a className='secondary-color hint' href={it.url_for('cashier')}>{it.L('Add funds')}</a>
                                            </div>
                                            <div className='gr-2 gr-padding-20'>
                                                <img src={it.url_for('images/pages/metatrader/dashboard/transfer.svg')} />
                                            </div>
                                            <div className='gr-5'>
                                                <img src={it.url_for('images/pages/metatrader/dashboard/mt5_wallet.svg')} />
                                                <div className='mt5-account gr-padding-10' />
                                                <div className='mt5-balance gr-padding-10 gr-parent' />
                                                <div className='hint'>{it.L('Deposit or withdraw below')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='gr-row'>
                                <div className='gr-6 gr-12-m flex'>
                                    <div className='mt-panel mt-container'>
                                        <form id='frm_deposit'>
                                            <CashierDesc title={it.L('Transfer funds to your MT5 account')} arrow_direction='right' desc={it.L('Transfer funds from your binary options account into your MetaTrader 5 account.')} />

                                            <div className='form'>
                                                <FormRow is_two_rows type='text' id='txt_amount_deposit' label={it.L('Amount')} attributes={{ maxLength: 10 }} />
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
                                            <CashierDesc title={it.L('Withdraw funds from your MT5 account')} arrow_direction='left' desc={it.L('Transfer funds from your MetaTrader 5 account into your binary options account.')} />

                                            <div className='form'>
                                                <FormRow is_two_rows type='text' id='txt_amount_withdrawal' label={it.L('Amount')} attributes={{ maxLength: 10 }} />
                                                <FormRow is_two_rows type='password' id='txt_main_pass_wd' label={it.L('MetaTrader 5 main password')} />
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
                        <div id='title_new_account'>{it.L('Create MetaTrader 5 [_1] account', '[_1]')}</div>
                        <div id='msg_switch'>{it.L('To perform this action, please switch to your [_1] Real Account.', it.website_name)}</div>
                        <div id='msg_upgrade'>{it.L('To perform this action, please <a href="[_1]">upgrade to [_2] Real Account</a>.', it.url_for('new_account/realws'), it.website_name)}</div>
                        <div id='msg_currency_not_match'>{it.L('Please switch to a [_1] account to manage funds.', '[_1]')}</div>
                        <div id='msg_real_financial'>
                            {it.L('To create a MetaTrader 5 real account, please:')}
                            <ul className='bullet'>
                                <li className='assessment invisible'>{it.L('Complete the <a href="[_1]">Financial Assessment</a>.', it.url_for('user/settings/assessmentws'))}</li>
                                <li className='authenticate invisible'>{it.L('<a href="[_1]">Authenticate</a> your account by verifying your identity and address.', it.url_for('user/authenticate'))}</li>
                            </ul>
                        </div>
                        <div id='msg_authenticate'>{it.L('To withdraw from MetaTrader 5 Financial Account please <a href="[_1]">Authenticate</a> your Binary account.', it.url_for('user/authenticate'))}</div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default Metatrader;
