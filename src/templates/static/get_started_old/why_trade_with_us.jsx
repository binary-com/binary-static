import React from 'react';

const Ul = ({ header, items }) => (
    <React.Fragment>
        <h2>{header}</h2>
        <ul>
            {items && items.map((item, i) => (
                <li key={i}><strong>{item.header}</strong> - {item.text}</li>
            ))}
        </ul>
        <br />
    </React.Fragment>
);

const WhyTradeWithUs = () => (
    <React.Fragment>
        <div className='section-content section-4'>
            <h1>{it.L('Why trade with [_1]', it.website_name)}</h1>

            <Ul header={it.L('Award-winning online trading platform')} items={[
                { header: it.L('Simple and intuitive'), text: it.L('Enjoy a trading platform that’s easy to navigate and use') },
                { header: it.L('Instant access'), text: it.L('Open an account and start trading in minutes. Deposits and withdrawals are also available 24/7') },
                { header: it.L('Available 24/7'), text: it.L('Trade when you want. [_1] is available 24/7, even on weekends', it.website_name) },
                { header: it.L('Patented technology'), text: it.L('Trade with the industry pioneer and holder of a patented pricing technology') },
                { header: it.L('Security and privacy'), text: it.L('Trade confidently, knowing that your personal data, transactions, and funds are always secure') },
            ]} />

            <Ul header={it.L('All market conditions and durations')} items={[
                { header: it.L('All markets and conditions'), text: it.L('Trade currencies, indices, commodities and more in rising, falling, sideways, quiet, and volatile markets') },
                { header: it.L('Short to long-term durations'), text: it.L('Choose timeframes from 10 seconds to 365 days') },
            ]} />

            <Ul header={it.L('Competitive and transparent pricing')} items={[
                { header: it.L('Sharp, benchmarked prices'), text: it.L('Benefit from the same rates of return as interbank traders. Our prices are benchmarked daily against the interbank options markets.') },
                { header: it.L('Transparent risk and potential reward'), text: it.L('Know how much you will win or lose before you purchase the contract') },
                { header: it.L('Protect your profits'), text: it.L('Sell your long-term contracts before expiry to protect any profits you may have made or to minimise your losses') },
                { header: it.L('Two-way pricing'), text: it.L('Receive quotes for a trade and counter-trade, so you always get unbiased, transparent rates from [_1]', it.website_name) },
            ]} />

            <Ul header={it.L('Ideal for beginners and experienced traders')} items={[
                { header: it.L('Low minimum stakes'), text: it.L('Deposit as little as USD 5 to start trading') },
                { header: it.L('Trade according to your preferred strategy'), text: it.L('Trade based on "gut feel" or rely on technical and fundamental analysis') },
                { header: it.L('Flexible'), text: it.L('Choose from over one million possible trade variations at any time, and customise your trades according to your preferred strategy') },
                { header: it.L('Scalable'), text: it.L('Earn the same proportional return on stakes of all values') },
            ]} />
        </div>
    </React.Fragment>
);

export default WhyTradeWithUs;
