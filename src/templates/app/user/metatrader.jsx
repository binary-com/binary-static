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
                <a href={it.url_for('metatrader/types-of-accounts')}>{it.L('MetaTrader 5 Account Comparison')}</a>
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
                <h1>{it.L('MetaTrader 5 Dashboard')}</h1>
            </div>
            <p id='page_msg' className='notice-msg center-text invisible'></p>
            <div id='mt_loading'><Loading /></div>
            <div id='mt_account_management' className='gr-row invisible'>
                <div id='mt_left_panel' className='gr-9 gr-8-t gr-12-p gr-12-m gr-no-gutter gr-gutter-right gr-no-gutter-p gr-no-gutter-m'>
                    <div id='account_details' className='mt-panel mt-container'>
                        <div className='gr-row'>
                            <div className='gr-adapt gr-hide-m gr-hide-p'>
                                <div id='acc_icon'></div>
                            </div>
                            <div className='gr-grow'>
                                <div className='gr-row'>
                                    <div className='gr-grow'>
                                        <div id='account_selector'>
                                            <h4 id='mt5_account'></h4>
                                            <div id='accounts_list'>
                                                <div className='list'></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='gr-grow gr-no-gutter'>
                                        <a className='button button-secondary act_new_account' href='javascript:;'>
                                            <span>{it.L('New')}</span>
                                        </a>
                                    </div>
                                </div>
                                <div className='acc-info has-account invisible'>
                                    <div className='gr-row gr-padding-10'>
                                        <div className='gr-3'>{it.L('Login ID:')}</div>
                                        <div className='gr-grow' data='login'></div>
                                    </div>
                                    <div className='gr-row'>
                                        <div className='gr-3'>{it.L('Name:')}</div>
                                        <div className='gr-grow' data='name'></div>
                                    </div>
                                    <div className='gr-row gr-padding-10 gr-hide mobile-balance'>
                                        <div className='gr-3'>{it.L('Balance:')}</div>
                                        <div className='gr-gutter' data='balance'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='gr-adapt align-end gr-hide-m gr-hide-p'>
                                <div className='acc-info has-account invisible'>
                                    <div>{it.L('Balance')}</div>
                                    <div className='balance gr-padding-10' data='balance'></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-panel'>
                        <div className='acc-actions'>
                            <span className='new-account gr-gutter invisible'>
                                <span></span>
                            </span>
                            <a href='javascript:;' className='act_cashier has-account center-text invisible'>
                                <span>{it.L('Manage Funds')}</span>
                            </a>
                            <a href='javascript:;' className='act_password_change has-account center-text invisible'>
                                <span>{it.L('Change Password')}</span>
                            </a>
                        </div>
                        <div className='fst-container mt-container'>
                            <div id='fst_action' className='invisible'>
                                <p id='main_msg' className='notice-msg center-text invisible'></p>
                                <div id='frm_action' className='invisible'></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='mt_right_panel' className='gr-3 gr-4-t gr-12-p gr-12-m gr-no-gutter gr-gutter-left gr-no-gutter-p gr-no-gutter-m'>
                    <div className='mt-panel'>
                        <div id='account_desc' className='mt-container border-bottom'></div>
                        <div className='mt-container'>
                            <p>{it.L('Trade platform quick links:')}</p>
                            <ul className='platforms'>
                                <li>
                                    <img src={it.url_for('images/pages/metatrader/dashboard/web.svg')} />
                                    <a href='https://trade.mql5.com/trade?servers=Binary.com-Server&amp;trade_server=Binary.com-Server' rel='noopener noreferrer' target='_blank'>{it.L('Web platform')}</a>
                                </li>
                                <li>
                                    <img src={it.url_for('images/pages/metatrader/dashboard/mac.svg')} />
                                    <a href='https://s3.amazonaws.com/binary-mt5/binary-mt5.dmg' download>{it.L('Download for Mac')}</a>
                                </li>
                                <li>
                                    <img src={it.url_for('images/pages/metatrader/dashboard/windows.svg')} />
                                    <a href='https://s3.amazonaws.com/binary-mt5/binarycom_mt5.exe' download>{it.L('Download for Windows')}</a>
                                </li>
                                <li>
                                    <img src={it.url_for('images/pages/metatrader/dashboard/linux.svg')} />
                                    <a href='https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux' rel='noopener noreferrer' target='_blank'>{it.L('Instructions for Linux')}</a>
                                </li>
                                <p className='badges'>
                                    <a href='https://download.mql5.com/cdn/mobile/mt5/ios?server=Binary.com-Server' rel='noopener noreferrer' target='_blank'>
                                        <span className='app-store-badge'></span>
                                    </a>
                                    <a href='https://download.mql5.com/cdn/mobile/mt5/android?server=Binary.com-Server' rel='noopener noreferrer' target='_blank'>
                                        <span className='google-play-badge'></span>
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
                        <div className='mt-type'></div>
                        <div className='mt-login invisible'></div>
                    </div>


                    <div className='account-desc'>
                        <AccountDesc title={it.L('Choose an account')}
                            description={it.L('[_1] offers a variety of account types to cater to the diverse needs of traders everywhere, whether you’re an experienced trader or just starting out.', it.website_name)} />
                        <AccountDesc account_type={['vanuatu_cent']} title={it.L('Cent Account')}
                            description={it.L('Our MetaTrader 5 Cent account is ideal for new traders who want to start trading with a smaller capital.')}
                            items={[
                                it.L('Offers the highest leverage – up to 1:1,000'),
                                it.L('Fixed spreads'),
                                it.L('Instant execution'),
                                it.L('No commission'),
                            ]} />
                        <AccountDesc account_type={['vanuatu_standard']} title={it.L('Standard Account')}
                            description={it.L('Our MetaTrader 5 Standard account comes with mid-range leverage and variable spreads suitable for a wide range of traders.')}
                            items={[
                                it.L('Leverage up to 1:300'),
                                it.L('Variable spreads'),
                                it.L('Market execution'),
                                it.L('No commission'),
                            ]} />
                        <AccountDesc account_type={['vanuatu_stp']} title={it.L('STP Account')}
                            description={it.L('Our MetaTrader 5 STP account provides you with the tightest spreads and connects you directly to the market.')}
                            items={[
                                it.L('Leverage up to 1:100'),
                                it.L('Variable spreads'),
                                it.L('Market execution'),
                                it.L('No commission'),
                            ]} />
                        <AccountDesc account_type={['costarica', 'malta']} title={it.L('Volatility Account')}
                            description={it.L('The Volatility account allows you to profit by speculating on the rise or fall of an instrument.')}
                            items={[
                                it.L('Leverage up to 1:500'),
                                it.L('Variable spreads'),
                                it.L('Market execution'),
                                it.L('No commission'),
                            ]} />
                    </div>

                    <form id='frm_new_account'>
                        <div id='mv_new_account'>
                            <div id='view_1' className='center-text'>
                                <div className='step-1'>
                                    <TypeGroup title={it.L('Step 1 : Choose demo or real account')} types={[
                                        { type: 'demo', id: 'rbtn_demo', title: it.L('Demo'), desc: it.L('Each demo account comes with [_1] virtual money', '$10,000') },
                                        { type: 'real', id: 'rbtn_real', title: it.L('Real'), desc: it.L('Real account allows you to trade in USD real currency') },
                                    ]} />
                                </div>
                                <div className='step-2 invisible'>
                                    <div className='separator-line gr-padding-10'></div>
                                    <TypeGroup title={it.L('Step 2 : Choose types of accounts')} types={[
                                        { type: 'template', desc: 'Cent' },
                                    ]}>
                                        <a className='hint' href={it.url_for('metatrader/types-of-accounts')}>{it.L('Which one suits me?')}</a>
                                    </TypeGroup>
                                </div>
                                <p id='new_account_msg' className='notice-msg center-text invisible'></p>
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
                                <FormRow is_two_rows type='password' id='txt_old_password'    label={it.L('Current password')} />
                                <FormRow is_two_rows type='password' id='txt_new_password'    label={it.L('New password')} hint={it.L('Minimum eight characters. Must contain numbers, and mix of upper and lower case letters.')} />
                                <FormRow is_two_rows type='password' id='txt_re_new_password' label={it.L('Verify new password')} />
                                <SubmitButton
                                    no_wrapper
                                    type='submit'
                                    text={it.L('Change Password')}
                                    attributes={{ action: 'password_change' }}
                                />
                            </div>
                        </div>
                    </form>

                    <div id='frm_cashier'>
                        <div className='gr-row demo-only invisible'>
                            <p className='gr-8 gr-push-2 gr-12-m gr-push-0-m gr-padding-30'>{it.L('This demo account comes with [_1] of the virtual fund. Contact our customer service to top up your demo account once virtual fund reaches zero.', '$10,000.00')}</p>
                        </div>
                        <div className='real-only invisible'>
                            <div className='gr-padding-20 gr-parent'>
                                <div className='fill-bg-color center-text mt-container'>
                                    <div className='gr-10 gr-push-1 gr-12-m gr-push-0-m'>
                                        <h3 className='secondary-color'>{it.L('Fund overview')}</h3>
                                        <p className='hint'>{it.L('To deposit your MetaTrader 5 Account, please top up the fund in your Binary Cashier then transfer the fund from Cashier to your MetaTrader 5 account.')}</p>
                                        <div className='gr-row'>
                                            <div className='gr-5'>
                                                <img src={it.url_for('images/pages/metatrader/dashboard/binary_wallet.svg')} />
                                                <div className='binary-account gr-padding-10'></div>
                                                <div className='binary-balance gr-padding-10 gr-parent'></div>
                                                <a className='secondary-color hint' href={it.url_for('cashier')}>{it.L('Add fund')}</a>
                                            </div>
                                            <div className='gr-2 gr-padding-20'>
                                                <img src={it.url_for('images/pages/metatrader/dashboard/transfer.svg')} />
                                            </div>
                                            <div className='gr-5'>
                                                <img src={it.url_for('images/pages/metatrader/dashboard/mt5_wallet.svg')} />
                                                <div className='mt5-account gr-padding-10'></div>
                                                <div className='mt5-balance gr-padding-10 gr-parent'></div>
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
                                            <CashierDesc title={it.L('Deposit into MT5 account')} arrow_direction='right' desc={it.L('Deposit funds from your Binary account into MetaTrader 5 account.')} />

                                            <div className='form'>
                                                <FormRow is_two_rows type='text' id='txt_amount_deposit' label={it.L('Amount')} attributes={{ maxLength: 10 }} />
                                                <SubmitButton
                                                    is_centered
                                                    is_full_width
                                                    type='submit'
                                                    text={it.L('Deposit')}
                                                    attributes={{ action: 'deposit' }}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className='gr-6 gr-12-m flex'>
                                    <div className='mt-panel mt-container'>
                                        <form id='frm_withdrawal'>
                                            <CashierDesc title={it.L('Withdraw from MT5 account')} arrow_direction='left' desc={it.L('Withdraw funds from MetaTrader 5 account into your Binary account.')} />

                                            <div className='form'>
                                                <FormRow is_two_rows type='password' id='txt_main_pass' label={it.L('MetaTrader 5 main password')} />
                                                <FormRow is_two_rows type='text' id='txt_amount_withdrawal' label={it.L('Amount')} attributes={{ maxLength: 10 }} />
                                                <SubmitButton
                                                    is_centered
                                                    is_full_width
                                                    type='submit'
                                                    text={it.L('Withdraw')}
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
                            {it.L('To create a real financial MT5 account, please complete the following:')}
                            <ul className='bullet'>
                                <li className='assessment invisible'>{it.L('Complete your <a href="[_1]">Financial Assessment</a>.', it.url_for('user/settings/assessmentws'))}</li>
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
