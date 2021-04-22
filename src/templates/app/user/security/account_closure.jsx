import React               from 'react';
// import { Client }          from '../../../../javascript/app/base/client';
// import { CommonFunctions } from '../../../../javascript/_common/common_functions';
import {
    FormRow,
    SubmitButton }         from '../../../_common/components/forms.jsx';
import Loading             from '../../../_common/components/loading.jsx';

import { SeparatorLine }   from '../../../_common/components/separator_line.jsx';

const ClosureDescription = ({
    id,
    list_items,
    list_title,
    subtitle,
    title,
    is_trading_limit,
}) => (
    <React.Fragment>
        <h3 className={`${id} ${id && 'invisible'}`}>{title}</h3>
        <div className={`${id} gr-padding-10 ${id && 'invisible'}`}>
            <p>{subtitle}</p>
            {is_trading_limit && <p>{it.L('[_1]Note[_2]: These limits are only applicable to your [_3] real account. To set limits, switch to the respective account and set your limits accordingly.', '<strong>', '</strong>', it.website_name)}</p>}
            {list_title && <p>{list_title}</p>}
            {list_items &&
                <ul className='bullet'>
                    { list_items.map((item, idx) => (
                        <li id={item.id} key={idx}>{item.text}</li>
                    ))}
                </ul>
            }
        </div>
    </React.Fragment>
);

const AccountClosureDialog = () => (
    <div id='account_closure_warning' className='account-closure-dialog lightbox'>
        <div id='account_closure_warning_content' className='account-closure-dialog-content gr-padding-10 gr-gutter'>
            <div className='center-text gr-padding-10'>
                <img
                    id='ic-emergency'
                    className='responsive'
                    src={it.url_for('images/pages/account_closure/ic-emergency.svg')}
                />
                <h1 className='gr-padding-10'>{it.L('Warning!')}</h1>
                <p className='warning-msg'>{it.L('If you deactivate:')}</p>
                <p className='warning-msg'>{it.L('You’ll be logged out automatically.')}</p>
                <p className='warning-msg'>{it.L('You will [_1]NOT[_2] be able to log in again.', '<span id="red-msg">', '</span>')}</p>
            </div>
            <div className='center-text gr-centered gr-padding-10 gr-child'>
                <a className='back button button-secondary' href='javascript:;'><span id='span-btn'>{it.L('Back')}</span></a>
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
            </div>
            <div id='account_closure_error_buttons' className='gr-padding-10 gr-child'>
                <button className='back button no-margin'>{it.L('OK')}</button>
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
            <h1>{it.L('Account Closure')}</h1>
        </div>
        <div id='msg_main' className='center-text gr-gutter gr-padding-30 invisible'>
            <p className='notice-msg'>
                {it.L('We\'re sorry to see you leave.')}
                <br />
                {it.L('Your account is now deactivated.')}
            </p>
        </div>
        <div id='closure_container' className='account-closure invisible'>
            <div id='main_header' className='gr-padding-30'>
                <h1 id='heading'>{it.L('Account Closure')}</h1>
                <p>{it.L('Closing your [_1] accounts involves closing all open positions in your accounts, withdrawing your funds, and deactivating your accounts.', it.website_name)}</p>
            </div>

            <div className='gr-no-gutter'>
                <div id='closure_accordion'>
                    <ClosureDescription
                        id='trading_limit'
                        title={it.L('I want to limit my trading activity instead')}
                        subtitle={it.L('You can set limits to your account and trading activities. Go to the [_1]self-exclusion page[_2] to manage your account limits.', `<a href="${it.url_for('user/security/self_exclusionws')}">`, '</a>')}
                        is_trading_limit
                    />
                    <ClosureDescription
                        id='real_unset' // real without currency
                        title={it.L('I want to set my currency instead')}
                        subtitle={it.L('You have an account but have not set a currency. You may [_1]choose one[_2] of these as your account currency', `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                        list_items={[]}
                    />
                    <ClosureDescription
                        id='fiat_1' // only fiat
                        title={it.L('I want to change my currency instead')}
                        subtitle={it.L('You have a [_1] account. You may [_2]change your currency[_3] to any of the following as long as you haven\'t made a deposit or created an MT5 account:', '<span id="current_currency_fiat"></span>', `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                        list_items={[]}
                    />
                    <ClosureDescription
                        id='fiat_2' // only fiat
                        title={it.L('I want to open a cryptocurrency account instead')}
                        subtitle={it.L('You can [_1]open a cryptocurrency[_2] account without closing your fiat currency account.', `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                        list_title={it.L('Choose one or more cryptocurrency accounts:')}
                        list_items={[]}
                    />
                    <ClosureDescription
                        id='crypto_1' // only crypto
                        title={it.L('I want to open a fiat currency account instead')}
                        subtitle={it.L('You can open a fiat currency account without closing your cryptocurrency account.')}
                        list_title={it.L('[_1]Choose a currency[_2] for your fiat currency account:', `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                        list_items={[]}
                    />
                    <ClosureDescription
                        id='crypto_2' // only crypto
                        title={it.L('I want to open another cryptocurrency account instead')}
                        subtitle={it.L('You have [_1]. You may open one or [_2]more cryptocurrency[_3] accounts:', '<span id="current_currency_crypto"></span>', `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                        list_items={[]}
                    />
                    <ClosureDescription
                        id='virtual'
                        title={it.L('I want to open a real account instead')}
                        subtitle={it.L('You can [_1]open a real account[_2] without closing your demo account.', `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                        list_title={it.L('Choose a currency for your real account:')}
                        list_items={[]}
                    />
                    <ClosureDescription
                        title={it.L('I want to change my affiliate instead')}
                        subtitle={it.L('If you want to change your affiliate, contact [_1]partners@binary.com[_2] for more information on how you can do this.', '<a href="mailto:partners@binary.com">', '</a>')}
                    />
                </div>
                <SeparatorLine className='gr-padding-20' />
                <div className='gr-padding-20 gr-hide gr-show-m' />
                <h2 className='primary-color account-closure-close-title'>{it.L('I want to close my account')}</h2>
                <div id='closing_steps' className='gr-padding-10 invisible'>
                    <p className='account-closure-subtitle'>{it.L('To close your account, complete the following steps:')}</p>
                    <div className='gr-padding-10'>
                        <h3 className='secondary-color'>{it.L('Step 1: Close all open positions')}</h3>
                        <p>{it.L('Go to the [_1]Portfolio[_2] to close all open positions from your Binary.com accounts.', `<a href="${it.url_for('user/portfoliows')}">`, '</a>')}</p>
                        <p className='invisible metatrader-link'>{it.L('If you have opened positions in your MT5 account, please close them too.')}</p>

                    </div>
                    <div className='gr-padding-10'>
                        <h3 className='secondary-color'>{it.L('Step 2: Withdraw your funds')}</h3>
                        <p>{it.L('Go to the [_1]Cashier[_2] to withdraw funds from your [_3] accounts.', `<a href="${it.url_for('cashier')}">`, '</a>', it.website_name)}</p>
                        <p className='invisible metatrader-link'>{it.L('Go to the [_1]MT5 dashboard[_2] to withdraw funds from your Binary.com MT5 account.', `<a href="${it.url_for('user/metatrader')}">`, '</a>')}</p>
                    </div>
                </div>
                <SeparatorLine />
                <p>{it.L('Please tell us why you are closing your account (please select one):')}</p>
                <FormRow
                    type='radio'
                    id='reason'
                    className='account-closure-form'
                    label_row_class='invisible'
                    options={[
                        {
                            label: it.L('Financial concerns'),
                            value: 'financial',
                        },
                        {
                            label: it.L('Too addictive'),
                            value: 'addictive',
                        },
                        {
                            label: it.L('Not interested in trading'),
                            value: 'not interested',
                        },
                        {
                            label: it.L('Prefer another trading website'),
                            value: 'another website',
                        },
                        {
                            label       : it.L('Others (please specify)'),
                            value       : 'other',
                            textfield_id: 'other_reason',
                        },

                    ]}
                />

                <SeparatorLine className='gr-padding-10' />
            </div>

            <div className='invisible' id='submit_loading'>
                <Loading />
            </div>

            <form id='form_closure'>
                <SubmitButton
                    text={it.L('Close my account')}
                    is_centered
                    type='submit'
                />
            </form>
            <AccountClosureDialog />
            <AccountClosureError />
        </div>
    </React.Fragment>
);

export default AccountClosure;
