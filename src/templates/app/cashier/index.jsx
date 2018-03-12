import React from 'react';

const DepositWithdraw = ({ ja_hide, ja_show, id, show_upgrade }) => {
    let deposit_url     = '/cashier/payment_agent_listws';
    let withdraw_url    = '/paymentagent/withdrawws';
    let class_hide_show = 'gr-5 gr-12-m';
    if (ja_hide) {
        deposit_url     = '/cashier/forwardws?action=deposit';
        withdraw_url    = '/cashier/forwardws?action=withdraw';
        class_hide_show += ' ja-hide';
    } else if (ja_show) {
        deposit_url     = '/cashier/deposit-jp';
        withdraw_url    = '/cashier/withdraw-jp';
        class_hide_show += ' invisible ja-show';
    }
    return (
        <div className={class_hide_show}>
            <div className='gr-padding-10 client_real invisible gr-parent'>
                <a className='toggle button client_real invisible' href={it.url_for(deposit_url)} id={id}>
                    <span className='deposit'>{it.L('Deposit')}</span>
                </a>
            </div>
            <div className='gr-padding-10 client_real invisible'>
                <a className='toggle button client_real invisible' href={it.url_for(withdraw_url)}>
                    <span className='withdraw'>{it.L('Withdraw')}</span>
                </a>
            </div>
            { show_upgrade &&
                <div className='gr-padding-10 invisible upgrademessage'>
                    <a className='button' />
                </div>
            }
        </div>
    );
};

const Cashier = () => (
    <React.Fragment>
        <h1>{it.L('Cashier')}</h1>

        <div className='invisible' id='message_bitcoin_cash'>
            <div className='notice-msg center-text'>
                <div className='gr-padding-10'>{it.L('Please note that you are currently using your [_1]Bitcoin Cash[_2] account. You can only fund your account in [_1]Bitcoin Cash[_2], and not Bitcoin.', '<a href="https://www.bitcoincash.org" target="_blank" rel="noopener noreferrer">', '</a>')}</div>
            </div>
        </div>

        <div className='gr-padding-10 table-body client_virtual invisible gr-parent'>
            <h3 className='gr-padding-10'>{it.L('Get more virtual money')}</h3>
            <div className='gr-row'>
                <div className='gr-2 gr-4-m'>
                    <img className='responsive' id='virtual_money_icon' src={it.url_for('images/pages/cashier/virtual_topup.svg')} />
                </div>
                <div className='gr-5 gr-12-m'>
                    <span className='ja-hide'>{it.L('You can request more virtual money if your virtual balance falls below USD 1,000.00.')}</span>
                    <span className='invisible ja-show'>{it.L('You can request more virtual money if your virtual balance falls below JPY 100,000.')}</span>
                </div>
                <div className='gr-5 gr-12-m invisible'>
                    <a className='toggle button' id='VRT_topup_link'>
                        <span className='ja-hide'>{it.L('Get USD 10,000.00')}</span>
                        <span className='invisible ja-show'>{it.L('Get JPY 1,000,000')}</span>
                    </a>
                </div>
            </div>
        </div>

        <div className='gr-padding-10 client_virtual invisible' />

        <div className='gr-padding-10 table-body'>
            <h3 className='gr-padding-10'>
                <span className='invisible normal_currency client_logged_out'>{it.L('Bank-wire, credit card, e-cash wallet')}</span>
                <span className='invisible crypto_currency'>{it.L('Cryptocurrency')}</span>
            </h3>
            <div className='gr-row'>
                <div className='gr-2 gr-4-m'>
                    <a className='ja-hide' href={it.url_for('cashier/forwardws?action=deposit')} id='payment_methods'>
                        <img className='responsive' id='payment_methods_icon' src={it.url_for('images/pages/cashier/payment-methods.svg')} />
                    </a>
                    <a className='invisible ja-show' href={it.url_for('cashier/deposit-jp')} id='payment_methods'>
                        <img className='responsive' id='payment_methods_icon' src={it.url_for('images/pages/cashier/japan_cashier.svg')} />
                    </a>
                </div>
                <div className='gr-5 gr-12-m'>
                    <span className='invisible normal_currency client_logged_out'>{it.L('Deposit or withdraw to your account via bank-wire, credit card, or e-cash wallet.')}</span>
                    <span className='invisible crypto_currency'>{it.L('Manage the funds in your cryptocurrency account.')}</span>
                    <a className='ja-hide invisible normal_currency client_logged_out' href={it.url_for('cashier/payment_methods')} id='view_payment_methods'>
                        <p>{it.L('View available payment methods')}</p>
                    </a>
                </div>
                <DepositWithdraw ja_hide show_upgrade id='deposit_btn_cashier' />
                <DepositWithdraw ja_show show_upgrade />
            </div>
        </div>

        <div className='gr-padding-10' />

        <div className='gr-padding-10 table-body ja-hide payment-agent invisible' id='payment-agent-section'>
            <h3 className='gr-padding-10'>{it.L('Payment Agent')}</h3>
            <div className='gr-row'>
                <div className='gr-2 gr-4-m'>
                    <a href={it.url_for('cashier/payment_agent_listws')} id='payment_agent'>
                        <img className='responsive' id='payment_agent_icon' src={it.url_for('images/pages/cashier/payment-agents.svg')} />
                    </a>
                </div>
                <div className='gr-5 gr-12-m'>
                    <span>{it.L('For e-cash methods or local currencies not supported by [_1].', it.website_name)}</span>
                    <p className='faded'>{it.L('Note: Withdrawal via payment agent is available only if you deposit exclusively via payment agent')}</p>
                </div>
                <DepositWithdraw />
            </div>
        </div>
    </React.Fragment>
);

export default Cashier;
