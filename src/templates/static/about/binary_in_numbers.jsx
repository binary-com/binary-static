import React from 'react';

const Numbers = ({ className, header, text, image }) => (
    <div className={className}>
        <span className='icon'></span>
        <div className='inner center-text'>
            <h2>{header}</h2>
            <p>{text}</p>
            <img className='chart' src={it.url_for(`images/pages/binary_in_numbers/charts/${image}.svg`)} />
        </div>
    </div>
);

const BinaryInNumbers = () => (
    <React.Fragment>
        <div className='gr-padding-10 static_full'>
            <h1 className='center-text'>{it.L('[_1] in Numbers', it.website_name)}</h1>
            <p className='center-text'>{it.L('In business since 2000, [_1] is the world’s leading binary options company.', it.website_name)}</p>
        </div>
        <div className='stacked-charts'>
            <Numbers
                className='client'
                header={it.L('Active trading clients')}
                text={it.L('[_1]’s number of active clients has risen nearly 5-fold in the last 5 years.', it.website_name)}
                image='chart-active-trading-clients'
            />
            <Numbers
                className='transaction'
                header={it.L('Number of transactions')}
                text={it.L('In last two years alone, over 276 million contracts were bought and sold on our platform.')}
                image='chart-num-transactions'
            />
            <Numbers
                className='turnover'
                header={it.L('Turnover')}
                text={it.L('We\'ve generated over USD 3 billion in turnover since inception, thanks to a rapid growth in business from 2010 onwards.')}
                image='chart-turnover'
            />
            <Numbers
                className='withdrawal'
                header={it.L('Client withdrawals')}
                text={it.L('Client withdrawals have grown nearly 8-fold over the last 5 years, to nearly USD 120 million.')}
                image='chart-client-withdrawals'
            />
            <Numbers
                className='employee'
                header={it.L('Number of employees and contractors')}
                text={it.L('We\'ve grown in size over the years -- both in terms of manpower and offices. We currently have over 130 employees across four offices in three countries: Malaysia, Malta and Japan.')}
                image='chart-num-employees'
            />
        </div>
    </React.Fragment>

);

export default BinaryInNumbers;
