import React from 'react';

const DepositWithdraw = ({ id, is_payment_agent, show_upgrade }) => (
    <div className='gr-5 gr-12-m'>
        <div className='gr-padding-10 client_real invisible gr-parent'>
            <a className='toggle button client_real invisible' href={it.url_for(is_payment_agent ? '/cashier/payment_agent_listws' : '/cashier/forwardws?action=deposit')} id={id}>
                <span className='deposit'>{it.L('Deposit')}</span>
            </a>
        </div>
        <div className='gr-padding-10 client_real invisible'>
            <a className='toggle button client_real invisible' href={it.url_for(is_payment_agent ? '/paymentagent/withdrawws' : '/cashier/forwardws?action=withdraw')}>
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

const Cashier = () => (
    <React.Fragment>
        <h1>{it.L('Cashier')}</h1>

        <div className='invisible' id='message_bitcoin_cash'>
            <div className='notice-msg center-text'>
                <div className='gr-padding-10'>{it.L('Please note that you are currently using your [_1]Bitcoin Cash[_2] account. You can only fund your account in [_1]Bitcoin Cash[_2], and not Bitcoin.', '<a href="https://www.bitcoincash.org" target="_blank" rel="noopener noreferrer">', '</a>')}</div>
            </div>
        </div>

        <div className='invisible' id='message_cashier_unavailable'>
            <p className='notice-msg center-text'>{it.L('Sorry, this feature is not available in your jurisdiction.')}</p>
        </div>

        <div className='gr-padding-10 table-body client_virtual invisible gr-parent'>
            <h3 className='gr-padding-10'>{it.L('Top up virtual account')}</h3>
            <div className='gr-row'>
                <div className='gr-2 gr-4-m'>
                    <img className='responsive' id='virtual_money_icon' src={it.url_for('images/pages/cashier/virtual_topup.svg')} />
                </div>
                <div className='gr-5 gr-12-m'>
                    <span>{it.L('You can top up your virtual account with an additional USD 10,000.00 if your balance falls below USD 1,000.00.')}</span>
                </div>
                <div className='gr-5 gr-12-m invisible'>
                    <a className='toggle button' id='VRT_topup_link'>
                        <span>{it.L('Get USD 10,000.00')}</span>
                    </a>
                </div>
            </div>
        </div>

        <div className='gr-padding-10 client_virtual invisible' />

        <div className='gr-padding-10 table-body'>
            <h3 className='gr-padding-10'>
                <span className='invisible normal_currency client_logged_out'>{it.L('Bank wire, credit card, e-wallet')}</span>
                <span className='invisible crypto_currency'>{it.L('Cryptocurrency')}</span>
            </h3>
            <div className='gr-row'>
                <div className='gr-2 gr-4-m'>
                    <a href={it.url_for('cashier/forwardws?action=deposit')} id='payment_methods'>
                        <img className='responsive' id='payment_methods_icon' src={it.url_for('images/pages/cashier/payment-methods.svg')} />
                    </a>
                </div>
                <div className='gr-5 gr-12-m'>
                    <span className='invisible normal_currency client_logged_out'>{it.L('Deposit or withdraw to your account via bank wire, credit card, or e-wallet.')}</span>
                    <span className='invisible crypto_currency'>{it.L('Manage the funds in your cryptocurrency account.')}</span>
                    <a className='invisible normal_currency client_logged_out' href={it.url_for('cashier/payment_methods')} id='view_payment_methods'>
                        <p>{it.L('View available payment methods')}</p>
                    </a>
                </div>
                <DepositWithdraw show_upgrade id='deposit_btn_cashier' />
            </div>
        </div>

        <div className='gr-padding-10' />

        <div className='gr-padding-10 table-body payment-agent invisible' id='payment-agent-section'>
            <h3 className='gr-padding-10'>{it.L('Payment Agent')}</h3>
            <div className='gr-row'>
                <div className='gr-2 gr-4-m'>
                    <a href={it.url_for('cashier/payment_agent_listws')} id='payment_agent'>
                        <img className='responsive' id='payment_agent_icon' src={it.url_for('images/pages/cashier/payment-agents.svg')} />
                    </a>
                </div>
                <div className='gr-5 gr-12-m'>
                    <span>{it.L('For e-wallets or local currencies not supported by [_1].', it.website_name)}</span>
                    <p className='faded'>{it.L('Note: Withdrawal via payment agent is available only if you deposit exclusively via payment agent')}</p>
                </div>
                <DepositWithdraw is_payment_agent />
            </div>
        </div>
    </React.Fragment>
);

export default Cashier;
