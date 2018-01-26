import React from 'react';

const WhatIsBinaryTrading = () => (
    <React.Fragment>
        <div className='section-content section-1'>
            <h1>{it.L('Why Choose Binary Trading?')}</h1>

            <h2>{it.L('Binary trading is very simple.')}</h2>
            <p>{it.L('A binary option is an option with a fixed payout that is determined at the start of the trade. If your prediction is correct, you receive an agreed payout. If not, you lose your initial stake, and no more. The options are called \'binary\' because there can be only two outcomes - win or lose.')}</p>

            <h2>{it.L('Binary trading is flexible.')}</h2>
            <p>{it.L('With [_1] you can trade:', it.website_name)}</p>
            <ul>
                <li>{it.L('<strong>All markets</strong> - currencies, stock indices, and commodities.')}</li>
                <li>{it.L('<strong>All market conditions</strong> - up/down, touch/no-touch, stays between/goes outside.')}</li>
                <li>{it.L('<strong>All durations</strong> - from 10 seconds to 365 days.')}</li>
                <li>{it.L('<strong>All payouts</strong> - from $1 to $50,000.')}</li>
            </ul>
            <br />

            <h2>{it.L('Binary trading is ideal for both individuals and market professionals.')}</h2>
            <h3>{it.L('Individual Traders')}</h3>
            <p>{it.L('If you\'re an individual trader, you\'ll appreciate the simplicity, flexibility, and limited risk of binary trading. With [_1]\'s low minimum stakes, you\'ll soon learn how to trade with skill and confidence. And if you have any questions, you\'re free to access <a href=\'[_2]\'>our helpful support desk</a>.', it.website_name, it.url_for('contact'))}</p>

            <h3>{it.L('Market Professionals')}</h3>
            <p>{it.L('Banks, hedge funds and professional investors routinely trade binary options in over-the-counter derivatives markets. Many market professionals use and trust the [_1] platform for high-volume flexible trades.', it.website_name)}</p>
        </div>
    </React.Fragment>
);

export default WhatIsBinaryTrading;
