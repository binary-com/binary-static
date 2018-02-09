import React from 'react';

const BeginnersFaq = () => (
    <div className='section-content section-10'>
        <h1>{it.L('FAQ')}</h1>
        <h2>{it.L('Opening an account')}</h2>

        <h3>{it.L('I\'m new to binaries, where do I start?')}</h3>
        <p>{it.L('The first step is to open an account. You can <a target=\'_blank\' href=\'[_1]\'>apply online</a> in just a few minutes.', it.url_for('/'))}</p>

        <h2>{it.L('Client funds')}</h2>
        <h3>{it.L('Where does [_1] hold my funds?', it.website_name)}</h3>
        <p>{it.L('We segregate all client funds and hold them in secure and licensed financial institutions, according to the conditions of our trading licenses.')}</p>

        <h3>{it.L('How does [_1] make money?', it.website_name)}</h3>
        <p>{it.L('[_1] has thousands of clients taking a variety of positions on the financial markets at any one time, and earns a small margin on these trades.', it.website_name)}</p>

        <h2>{it.L('Depositing and withdrawing funds')}</h2>
        <h3>{it.L('Do I need to deposit any funds to open an account?')}</h3>
        <p>{it.L('You don\'t need to deposit any money to open an account, but you need to deposit funds before you can start trading.')}</p>

        <h3>{it.L('How do I fund my account?')}</h3>
        <p>{it.L('[_1] offers a range of common deposit and withdrawal methods, from credit and debit cards to bank wires, e-cash and e-wallets.', it.website_name)}</p>

        <h3>{it.L('Is it possible to deposit the same funds through different payment methods?')}</h3>
        <p>{it.L('Unfortunately, no - funds initially deposited through one payment method must be withdrawn through the same system; funds cannot be transferred to an alternate system for withdrawal. We do offer a wide variety of payment methods, to suit your specific needs and preferences.')}</p>

        <h2>{it.L('Learning to trade')}</h2>
        <h3>{it.L('Do you offer virtual-money accounts?')}</h3>
        <p>{it.L('[_1] offers a virtual-money account so you can get the hang of trading binaries. Why not <a href=\'[_2]\'>open a free $10k fully-functional virtual-money account</a>, and start learning how to trade.', it.website_name, it.url_for('/'))}</p>

        <h3>{it.L('Will I need to install any software?')}</h3>
        <p>{it.L('[_1] is entirely web-based and requires no software installation.', it.website_name)}</p>

        <h3>{it.L('How soon can I start trading?')}</h3>
        <p>{it.L('You can <a href=\'[_1]\'>open an account</a>, deposit funds and begin trading within minutes.', it.url_for('/'))}</p>
    </div>
);

export default BeginnersFaq;
