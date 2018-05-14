import React from 'react';

const Withdraw = () => (
    <div id='japan_cashier_container'>
        <h1>{it.L('Withdraw') }</h1>
        <p id='cashier_error_message' className='invisible notice-msg center-text' />
        <p id='cashier_locked_message' className='invisible'>{it.L('{JAPAN ONLY}Your cashier is locked as per your request - to unlock it, please click <a href="[_1]">here</a>.', it.url_for('user/security/cashier_passwordws'))}</p>
        <div id='cashier_unlocked_message' className='invisible'>
            <p>{it.L('{JAPAN ONLY}You can request a funds transfer to your designated bank account at any time.')}</p>
            <p>{it.L('{JAPAN ONLY}You must have sufficient balance in your trading account at the time of transfer.')}</p>
            <p>{it.L('{JAPAN ONLY}Please note the maximum regular withdrawal amount is ¥1,000,000.')}</p>
            <p>{it.L('{JAPAN ONLY}Please contact <a href=\'mailto:[_1]\'>[_1]</a> if you need to withdraw more than the maximum amount, as further ID verification is required.', 'support@binary.com')}</p>
            <p>{it.L('{JAPAN ONLY}Please allow up to 5 business days for the funds to be credited to your designated bank account.')}</p>
            <p>{it.L('{JAPAN ONLY}If your bank account details have changed, please contact Customer Support in order to verify your ID and new account details.')}</p>
            <p>{it.L('{JAPAN ONLY}Please input the amount you would like to withdraw and press the Request button.')}</p>
            <form role='form' aria-label='Withdrawal Request' className='form js-form' action='http://www.123formbuilder.com/form-2231594/Withdrawal-Request' id='mainform123' method='post' name='mainform123' encType='multipart/form-data' noValidate>
                <input type='hidden' name='action' value='verify'/>
                <input type='hidden' name='tmp_referer' value='https://www.123formbuilder.com/index.php?tabid=2&p=publish&id=2231594'/>
                <input type='hidden' name='tmp_form_host' value='https://www.123formbuilder.com/ajax_call.php'/>
                <input type='hidden' size='30' name='viewformr' id='viewformr' value='cfr_1524635174.5501' />
                <input type='hidden' name='f_autoresponder' id='f_autoresponder' value='0'/>
                <input type='hidden' name='special_autoresponder' id='special_autoresponder' value=''/>
                <input type='hidden' name='submXMLDatetimeStart' id='submXMLDatetimeStart' value='2018-04-25 05:46:14' />
                <input type='hidden' id='language' name='language' value='en'/><input type='hidden' id='language-changed' name='languageChanged' value='no'/>
                <div className='gr-padding-10'>
                    <label id='id123-title22598118' htmlFor='id123-control22598118' style={{marginRight: '13px'}}>口座番号</label>
                    <input id='id123-control22598118' name='control22598118' type='text' />
                    <p className='error-msg invisible'>{it.L('This field is required.')}</p>
                </div>
                <div className='gr-padding-10'>
                    <label id='id123-title22598060' htmlFor='id123-control22598060' style={{marginRight: '13px'}}>メール</label>
                    <input id='id123-control22598060' name='control22598060' type='text' />
                    <p className='error-msg invisible'>{it.L('This field is required.')}</p>
                </div>
                <div className='gr-padding-10'>
                    <label id='id123-title22598145' htmlFor='id123-control22598145' style={{marginRight: '13px'}}>出金額</label>
                    ¥<input id='id123-control22598145' name='control22598145' type='text' autoComplete='off' style={{marginLeft: '3px'}} />
                    <p className='error-msg invisible' />
                </div>
                <div className='gr-padding-10'>
                    <button type='submit' id='id123-button-send'>送信</button>
                </div>
            </form>
        </div>
    </div>
);

export default Withdraw;
