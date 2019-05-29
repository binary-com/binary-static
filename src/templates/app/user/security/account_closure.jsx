import React from 'react';
import Loading from '../../../_common/components/loading.jsx';
import { SeparatorLine } from '../../../_common/components/separator_line.jsx';
import { SubmitButton } from '../../../_common/components/forms.jsx';

const AccountClosure = () => (
    <React.Fragment>
        <div className='gr-padding-30'>
            <h1 id='heading'>{it.L('Account Closure')}</h1>
            <p>{it.L(`Closing your ${it.website_name} accounts involves closing all open positions in your accounts, and withdrawing your funds, and deactivating your accounts with ${it.website_name}`)}</p>
        </div>

        <div className='invisible' id='closure_loading'>
            <Loading />
        </div>

        <div id='msg_main' className='center-text gr-gutter gr-padding-10 invisible'>
            <h2>{it.L('Account closure confirmed')}</h2>
            <p>{it.L(`Accounts closed successfully. A confirmation email will be sent to your email. This page will redirect to the ${it.website_name} homepage after 10 seconds.`)}</p>
        </div>

        <div className='gr-no-gutter invisible' id='closure_description'>
            <h2 className='primary-color'>{it.L('What would you like to do?')}</h2>
            <fieldset>
                <div className='gr-padding-20 gr-gutter-left gr-gutter-right'>
                    <ClosureDescription
                        title={it.L('Create crypto account')}
                        subtitle={it.L('Open an account in the cryptocurrency of your choice:')}
                        list_items={[
                            it.L('Bitcoin (BTC)'),
                            it.L('Ether (ETH)'),
                            it.L('Litecoin (LTC)'),
                            it.L('Tether (UST)'),
                        ]}
                    />
                    <ClosureDescription
                        title={it.L('Change my affiliate')}
                        subtitle={it.L('Contact affiliates@binary.com for more info on changing your affiliate.')}
                    />
                    <ClosureDescription
                        title={it.L('Change my account limits')}
                        subtitle={it.L('You may set limits in your account to help prevent unwanted losses.[_1]Go to self-exclusion page to manage your account limits.', '<br />')}
                    />
                </div>
            </fieldset>
            {/* TODO: complete these component */}
            <h2 className='primary-color'>{it.L('Close open positions')}</h2>
            <ClosureDescription
                title={it.L('Close open positions')}
                list_items={[
                    it.L('Remember to close all open positions in [_1]all[_2] your accounts.', '<strong>', '</strong>'),
                    it.L('Go to portfolio page to close your open positions.'),
                ]}
            />
            <SeparatorLine className='gr-padding-10' />
        </div>

        <form className='invisible' id='frm_closure'>
            <SubmitButton
                text={it.L('Close my account')}
                custom_msg_text={it.L('Click the button below to initiate the account closure process.')}
                is_centered
                type='submit'
            />
        </form>
    </React.Fragment>
);

const ClosureDescription = ({
    list_items,
    subtitle,
    title,
}) => (
    <div className='gr-padding-10'>
        <h3 className='secondary-color'>{title}</h3>
        <p>{subtitle}</p>
        { list_items &&
            <ul className='bullet'>
                { list_items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))
                }
            </ul>
        }
    </div>
);

export default AccountClosure;
