import React from 'react';
import { Tbody } from '../../../_common/components/elements.jsx';

const Deposit = () => {
    const trs = [
        [{ text: it.L('{JAPAN ONLY}Bank') },           { text: it.L('{JAPAN ONLY}Rakuten Bank') }],
        [{ text: it.L('{JAPAN ONLY}Branch') },         { text: it.L('{JAPAN ONLY}#1 Sales Division') }],
        [{ text: it.L('{JAPAN ONLY}Branch Code') },    { text: it.L('{JAPAN ONLY}251') }],
        [{ text: it.L('{JAPAN ONLY}Account Type') },   { text: it.L('{JAPAN ONLY}Savings') }],
        [{ text: it.L('{JAPAN ONLY}Account Number') }, { text: it.L('{JAPAN ONLY}7546677') }],
        [{ text: it.L('{JAPAN ONLY}Account Name') },   { text: it.L('{JAPAN ONLY}Binary K.K. Customer Account') }],
    ];
    return (
        <div id='japan_cashier_container'>
            <div className='gr-row'>
                <h1 className='gr-11 gr-10-m'>{it.L('Deposit')}</h1>
                <a className='gr-1 gr-2-m no-print align-end' href='javascript:window.print()'>
                    <img className='responsive' src={it.url_for('images/common/print.svg')} />
                </a>
            </div>
            <p id='cashier_locked_message' className='invisible'>{it.L('{JAPAN ONLY}Your cashier is locked as per your request - to unlock it, please click <a href="[_1]">here</a>.', it.url_for('user/security/cashier_passwordws'))}</p>
            <div id='cashier_unlocked_message' className='invisible'>
                <p>{it.L('{JAPAN ONLY}Please make a bank transfer from your designated bank account to:')}</p>
                <table>
                    <Tbody trs={trs} />
                </table>
                <p>{it.L('{JAPAN ONLY}Please make sure you add your [_1] account ID to the Remitter\'s account name, or it will delay crediting the funds to your account:',it.website_name)}</p>
                <p>{it.L('{JAPAN ONLY}Remitter\'s Name:')} <span id='name_id' /></p>
                <p>{it.L('{JAPAN ONLY}Please note we can only accept payments from your designated bank account and no other account in your name.')}</p>
                <p>{it.L('{JAPAN ONLY}If you wish to change your designated account or you have any other queries, then please contact Customer Support.')}</p>
                <p>{it.L('{JAPAN ONLY}Please note our maximum deposit limit for a single transaction is ¥1,000,000.')}</p>
                <p>{it.L('{JAPAN ONLY}Please allow up to 3 business days for the funds to be credited to your trading account.')}</p>
            </div>
        </div>
    );
};

export default Deposit;
