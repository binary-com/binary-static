import React from 'react';

const Glossary = () => (
    <div className='section-content section-11'>
        <h1>{it.L('Glossary')}</h1>

        <h2>{it.L('Barrier(s)')}</h2>
        <p>{it.L('The barrier of a binary option trade is the price target you set for the underlying. You can choose trades that stay below or go above a price target, or stay between two targets.')}</p>

        <h2>{it.L('Binary option')}</h2>
        <p>{it.L('A binary option is a contract purchased by a trader, which pays a pre-determined amount if their prediction is correct.')}</p>

        <h2>{it.L('Commodities')}</h2>
        <p>{it.L('Commodities are resources that are grown or extracted from the ground, such as silver, gold and oil. On [_1], they are priced in US dollars.', it.website_name)}</p>

        <h2>{it.L('Contract period')}</h2>
        <p>{it.L('The contract period is the timeframe of a trade. It is also called the duration.')}</p>

        <h2>{it.L('Derivative')}</h2>
        <p>{it.L('A derivative is a financial instrument whose value is determined by reference to an underlying market. Derivatives are commonly traded in the inter-bank market, and binaries are one of the simplest forms of derivatives.')}</p>

        <h2>{it.L('Duration')}</h2>
        <p>{it.L('The duration is the length of a purchased trade (see \'contract period\').')}</p>

        <h2>{it.L('Ends Between/Ends Outside trades')}</h2>
        <p>{it.L('An Ends Between trade pays out if the market exit price is strictly higher than the low price target AND strictly lower than the high price target. An Ends Outside binary pays out if the market exit price is EITHER strictly higher than the high price target OR strictly lower than the low price target.')}</p>

        <h2>{it.L('Entry spot price')}</h2>
        <p>{it.L('The entry spot price is the starting price of the trade purchased by a trader.')}</p>

        <h2>{it.L('Expiry price')}</h2>
        <p>{it.L('The expiry price is the price of the underlying when the contract expires.')}</p>

        <h2>{it.L('Forex')}</h2>
        <p>{it.L('In foreign exchange markets, traders can enter contracts based on the change in price of one currency as it relates to another currency. For example if a trader selects Rise in the EUR/USD market, they are predicting that the value of the Euro will rise in relation to the value of the US dollar.')}</p>

        <h2>{it.L('GMT')}</h2>
        <p>{it.L('GMT stands for Greenwich Mean Time, the official time used in the UK during winter. In summer, the UK changes to British Summer Time, which is GMT + 1 hour. All times on the [_1] site use GMT all year round.', it.website_name)}</p>

        <h2>{it.L('Higher/Lower trades')}</h2>
        <p>{it.L('These are trades where the trader predicts if a market will finish higher or lower than a specified price target.')}</p>

        <h2>{it.L('Indices')}</h2>
        <p>{it.L('Stock market indices measure the value of a selection of companies in the stock market.')}</p>

        <h2>{it.L('In/Out trades')}</h2>
        <p>{it.L('These are trades where the trader selects a low and high barrier, and predicts if the market will stay within these barriers or go outside them (see also \'Stays Between/Goes Outside trades\').')}</p>

        <h2>{it.L('Market exit price')}</h2>
        <p>{it.L('The market exit price is the price in effect at the end of the contract period.')}</p>

        <h2>{it.L('No Touch trades')}</h2>
        <p>{it.L('These are trades where the trader selects a price target, and predicts that the market will never touch the target before the expiry of the trade.')}</p>

        <h2>{it.L('(One) Touch trades')}</h2>
        <p>{it.L('These are trades where the trader selects a price target, and predicts that the market will touch the target before the expiry of the trade.')}</p>

        <h2>{it.L('Payout')}</h2>
        <p>{it.L('The payout is the amount paid to an options trader if their prediction is correct.')}</p>

        <h2>{it.L('Pip')}</h2>
        <p>{it.L('Pip stands for \'percentage in point\' which is generally the fourth decimal place (i.e. 0.0001).')}</p>

        <h2>{it.L('Profit')}</h2>
        <p>{it.L('The profit is the difference between the purchase price (the stake) and the payout on a winning trade.')}</p>

        <h2>{it.L('Volatility Indices')}</h2>
        <p>{it.L('The volatility indices simulate various real market situations and provide an ideal platform for getting used to trading and testing strategies under various market conditions. These indices depend on volatility and drift, and help users to try out scenarios like - high volatility, low volatility, bullish and bearish trends.')}</p>

        <h2>{it.L('Resale price')}</h2>
        <p>{it.L('The resale price indicates a contract\'s current market price. Resale prices are on a best-efforts basis and may not be available at all times after purchase. See \'Sell option\' for more details on selling contracts before expiry.')}</p>

        <h2>{it.L('Return')}</h2>
        <p>{it.L('The return is the money realized when the contract expires (see \'Payout\').')}</p>

        <h2>{it.L('Rise/Fall trades')}</h2>
        <p>{it.L('These are trades where the trader predicts if a market will rise or fall at the end of a selected time period.')}</p>

        <h2>{it.L('Sell option')}</h2>
        <p>{it.L('It is sometimes possible to sell an option before the expiry of a trade, but only if a fair price can be determined. If this option is available, you will see a blue \'Sell\' button next to your trade in the portfolio.')}</p>

        <h2>{it.L('Spot price')}</h2>
        <p>{it.L('This is the current price at which an underlying can be bought or sold at a particular time.')}</p>

        <h2>{it.L('Stake')}</h2>
        <p>{it.L('The stake is the amount that a trader must pay to enter into a trade.')}</p>

        <h2>{it.L('Stays Between/Goes Outside trades')}</h2>
        <p>{it.L('A Stays Between trade pays out if the market stays between (does not touch) BOTH the high barrier or the low barrier at any time during the period chosen by a trader. A Goes Outside trade pays out if the market touches EITHER the high barrier or the low barrier at any time during the period chosen by a trader.')}</p>

        <h2>{it.L('Tick')}</h2>
        <p>{it.L('A tick is the minimum upward or downward movement in the price of a market.')}</p>

        <h2>{it.L('Underlying')}</h2>
        <p>{it.L('Each binary option is a prediction on the future movement of an underlying market.')}</p>
    </div>
);

export default Glossary;