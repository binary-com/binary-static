import React from 'react';

const Withdraw = () => (
    <div id='japan_cashier_container'>
        <h1>{it.L('Withdraw') }</h1>
        <p id='cashier_locked_message' className='invisible'>{it.L('{JAPAN ONLY}Your cashier is locked as per your request - to unlock it, please click <a href="[_1]">here</a>.', it.url_for('user/security/cashier_passwordws'))}</p>
        <div id='cashier_unlocked_message' className='invisible'>
            <p>{it.L('{JAPAN ONLY}You can request a funds transfer to your designated bank account at any time.')}</p>
            <p>{it.L('{JAPAN ONLY}You must have sufficient balance in your trading account at the time of transfer.')}</p>
            <p>{it.L('{JAPAN ONLY}Please note the maximum regular withdrawal amount is ¥1,000,000.')}</p>
            <p>{it.L('{JAPAN ONLY}Please contact <a href=\'mailto:[_1]\'>[_1]</a> if you need to withdraw more than the maximum amount, as further ID verification is required.', 'support@binary.com')}</p>
            <p>{it.L('{JAPAN ONLY}Please allow up to 5 business days for the funds to be credited to your designated bank account.')}</p>
            <p>{it.L('{JAPAN ONLY}If your bank account details have changed, please contact Customer Support in order to verify your ID and new account details.')}</p>
            <p>{it.L('{JAPAN ONLY}Please input the amount you would like to withdraw and press the Request button.')}</p>
            <form className='form js-form' action='http://www.123formbuilder.com/form-2231594/Contact-Lead-Form' method='post' name='mainform123' encType='multipart/form-data' noValidate>
                <input type='hidden' name='action' value='verify' />
                <input type='hidden' size='30' name='viewformr' id='viewformr' value='cfr_1475803511.8284' />
                <input type='hidden' name='f_autoresponder' id='f_autoresponder' value='0' />
                <input type='hidden' name='special_autoresponder' id='special_autoresponder' value='' />
                <input type='hidden' id='language' name='language' value='en' />
                <input type='hidden' id='language-changed' name='languageChanged' value='no' />
                <input type='hidden' name='PHPSESSID' value='ch3fb19se9tad0b7j2jhnemj56' />
                <input type='hidden' name='activepage' id='activepage' value='1' />
                <input type='hidden' name='totalpages' id='totalpages' value='1' />
                <input type='hidden' name='usage' value='e' />
                <label htmlFor='id123-control22598145' style={{marginRight: '13px'}}>出金額</label>
                ¥<input id='id123-control22598145' style={{marginLeft: '3px'}} name='control22598145' type='text' autoComplete='off' />
                <input id='id123-control22598118' name='control22598118' type='hidden' />
                <input id='id123-control22598060' name='control22598060' type='hidden' />
                <button type='submit' style={{marginLeft: '16px', marginTop: '-5px'}}>送信</button>
            </form>
        </div>
    </div>
);

export default Withdraw;
