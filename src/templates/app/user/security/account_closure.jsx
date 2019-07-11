import React             from 'react';
import {
    FormRow,
    SubmitButton }       from '../../../_common/components/forms.jsx';
import Loading           from '../../../_common/components/loading.jsx';
import { SeparatorLine } from '../../../_common/components/separator_line.jsx';
    
const AccountClosure = () => (
    <React.Fragment>
        <div id='msg_main' className='center-text gr-gutter gr-padding-10 invisible'>
            <h1>{it.L('Account closure confirmed')}</h1>
            <p className='notice-msg'>
                {it.L('Accounts closed successfully. A confirmation email will be sent to your email.')}
                <br />
                {it.L('This page will redirect to the [_1] homepage after 10 seconds.', it.website_name)}
            </p>
        </div>
        <div id='closure_container' className='invisible'>
            <div id='main_header' className='gr-padding-30'>
                <h1 id='heading'>{it.L('Account Closure')}</h1>
                <p>{it.L('Closing your [_1] accounts involves closing all open positions in your accounts, withdrawing your funds, and deactivating your accounts with [_1].', it.website_name)}</p>
            </div>

            <div className='gr-no-gutter' id='closure_description'>
                <h2 className='primary-color'>{it.L('What would you like to do?')}</h2>
                <fieldset>
                    <div className='gr-padding-20 gr-gutter-left gr-gutter-right'>
                        <ClosureDescription
                            id='open-real'
                            title={it.L('[_1]Open a real account[_2] in the currency of your choice', `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                            list_items={[]}
                        />
                        {/* <ClosureDescription
                            id='change-fiat'
                            title={it.L('Change my account currency')}
                            subtitle={it.L('[_1]Change your fiat currency[_2] to any of the following:', `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                            list_items={[]}
                        />
                        <ClosureDescription
                            id='crypto'
                            title={it.L('Create a crypto account')}
                            subtitle={it.L('[_1]Open an account[_2] in the cryptocurrency of your choice:', `<a href="${it.url_for('user/accounts')}">`, '</a>')}
                            list_items={[]}
                        /> */}
                        <ClosureDescription
                            title={it.L('Change my affiliate')}
                            subtitle={it.L('Contact [_1] for more information on changing your affiliate.', '<a href="mailto:affiliates@binary.com">affiliates@binary.com</a>')}
                        />
                        <ClosureDescription
                            title={it.L('Change my account limits')}
                            subtitle={
                                <span>
                                    {it.L('You may set limits in your account to help prevent unwanted losses.')}<br />
                                    {it.L('Go to [_1]self-exclusion page[_2] to manage your account limits.', `<a href=${it.url_for('user/security/self_exclusionws')}>`, '</a>')}<br />
                                    {it.L('[_1]Note:[_2] These limits are only applicable to your <currency> account. To set limits for the rest of your real accounts, switch to the respective account and set your limits accordingly. this applies when client has more than 1 real account', '<strong>', '</strong>')}
                                </span>
                            }
                        />
                    </div>
                </fieldset>
                <h2 className='primary-color'>{it.L('Close open positions')}</h2>
                <ClosureDescription
                    title={it.L('Close open positions')}
                    list_items={[
                        { text: it.L('Remember to close all open positions in [_1]all[_2] your accounts.', '<strong>', '</strong>') },
                        { text: it.L('Go to the [_1]portfolio page[_2] to close your open positions.', `<a href="${it.url_for('user/portfoliows')}">`, '</a>') },
                    ]}
                />
                <ClosureDescription
                    title={it.L('Withdraw funds')}
                    subtitle={it.L('Remember to withdraw your funds from [_1]all[_2] your accounts', '<strong>', '</strong>')}
                    list_items={[
                        { text: it.L('Go to [_1]Cashier[_2] to withdraw.', `<a href="${it.url_for('cashier')}">`, '</a>') },
                        {
                            id  : 'mt5_withdraw',
                            text: it.L('Go to [_1]MT5 dashboard[_2] to withdraw from your [_3] MT5 account.', `<a href="${it.url_for('user/metatrader')}">`, '</a>', it.website_name),
                        },
                    ]}
                />
                <SeparatorLine className='gr-padding-10' />

                <h2 className='primary-color'>{it.L('Reason for closure')}</h2>
                <p>{it.L('Why do you want to close your account? (Please select one)')}</p>
                <FormRow
                    type='radio'
                    id='reason'
                    className='account-closure'
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
            
            <div className='invisible' id='closure_loading'>
                <Loading />
            </div>

            <form id='form_closure'>
                <SubmitButton
                    text={it.L('Close my account')}
                    custom_msg_text={it.L('Click the button below to initiate the account closure process.')}
                    is_centered
                    type='submit'
                />
            </form>
        </div>
    </React.Fragment>
);

const ClosureDescription = ({
    id,
    list_items,
    subtitle,
    title,
}) => (
    <div id={id} className='gr-padding-10'>
        <h3 className='secondary-color'>{title}</h3>
        <p>{subtitle}</p>
        { list_items &&
            <ul className='bullet'>
                { list_items.map((item, idx) => (
                    <li id={item.id} key={idx}>{item.text}</li>
                ))}
            </ul>
        }
    </div>
);

export default AccountClosure;
