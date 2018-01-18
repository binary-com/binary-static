import React from 'react';

const BinaryOptionsBasics = () => (
    <div className='section-content section-3'>
        <h1>{it.L('Binary Options Basics')}</h1>
        <p>{it.L('Binary options are easy to understand. They\'re called \'binary\' because there can be only two outcomes - win or lose. If your prediction is correct, you receive a payout that is determined at the start of the trade. If not, you just lose your initial stake.')}</p>
        <img className='responsive' id='lga_icon_footer' src={it.url_for('images/pages/get-started/binary-option-basics.svg')} />
        <p>{it.L('You only need to make four decisions to execute a binary contract.')}</p>

        <h2>1. {it.L('Choose the Underlying')}</h2>
        <p>{it.L('The first thing to do is choose the asset you wish to trade, such as gold or oil, stocks or FX rates (The value of a binary option is derived from the price of the underlying asset). A big advantage of trading options is that you are not buying or selling the actual asset.')}</p>

        <h2>2. {it.L('Choose the Duration of the Trade')}</h2>
        <p>{it.L('Each binary option contract runs for a set time - with [_1] you can choose a contract that runs between 10 seconds and 365 days.', it.website_name)}</p>

        <h2>3. {it.L('Choose how you want to Trade the Market')}</h2>
        <p>{it.L('[_1] offers you four ways to trade a particular asset:', it.website_name)}</p>
        <ul>
            <li><strong>{it.L('Rise/Fall')}</strong> - {it.L('Predict the market rising or falling from its current level.')}</li>
            <li><strong>{it.L('Higher/Lower')}</strong> - {it.L('Predict the market ending higher or lower than a price target.')}</li>
            <li><strong>{it.L('Touch/No Touch')}</strong> - {it.L('Predict the market touching or not touching a price target.')}</li>
            <li><strong>{it.L('In/Out')}</strong> - {it.L('Predict the market staying between or going outside two price targets.')}</li>
        </ul>
        <br />

        <h2>4. {it.L('Choose your Stake and Potential Return')}</h2>
        <p>{it.L('Specify your payout, which is your potential return if your prediction is correct. Our system will proceed to calculate your stake, which is the total cost of purchasing the contract. [_1] offers payouts from $1 to $50,000.', it.website_name)}</p>
    </div>
);

export default BinaryOptionsBasics;
