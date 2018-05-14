import React from 'react';

const Submit = () => (
    <React.Fragment>
        <h1>{it.L('{JAPAN ONLY}Acknowledgment')}</h1>
        <p>{it.L('{JAPAN ONLY}Thank you for your withdrawal request.')}</p>
        <p>{it.L('{JAPAN ONLY}We will process your request and transfer the funds to your designated bank account within 5 business days.')}</p>
        <p>{it.L('{JAPAN ONLY}Please ensure you maintain sufficient balance in your trading account.')}</p>
        <p>{it.L('{JAPAN ONLY}If you have any queries or wish to cancel the request, please contact <a href=\'mailto:[_1]\'>Customer Support</a>.', 'support@binary.com')}</p>
        <a className='button' href={it.url_for('multi_barriers_trading')}>
            <span>{it.L('{JAPAN ONLY}Continue Trading')}</span>
        </a>
    </React.Fragment>
);

export default Submit;
