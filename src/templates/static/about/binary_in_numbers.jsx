import React from 'react';

const Numbers = ({ className, header, text, image }) => (
    <div className={className}>
        <span className='icon' />
        <div className='inner center-text'>
            <h2 data-anchor={className}>{header}</h2>
            <p>{text}</p>
            <img className='chart' src={it.url_for(`images/pages/binary_in_numbers/charts/${image}.svg`)} />
        </div>
    </div>
);

const BinaryInNumbers = () => (
    <React.Fragment>
        <div className='gr-padding-10 static_full'>
            <h1 className='center-text'>{it.L('[_1] in Numbers', it.website_name)}</h1>
            <p className='center-text'>{it.L('In business since 2000, [_1] is the world\'s leading binary options company.', it.website_name)}</p>
        </div>
        <div className='stacked-charts'>
            <Numbers
                className='client'
                header={it.L('Active trading clients')}
                text={it.L('Our active client base exceeded [_1] clients in [_2].', '127,000', '2019')}
                image='chart-active-trading-clients'
            />
            <Numbers
                className='transaction'
                header={it.L('Number of transactions')}
                text={it.L('Our customers bought more than 275 million contracts on Binary.com in 2019, bringing the total number of contracts sold to over 1 billion since commencing business.')}
                image='chart-num-transactions'
            />
            <Numbers
                className='turnover'
                header={it.L('Turnover')}
                text={it.L('In 2019, Binary.com generated more than USD 1.5 billion in turnover, bringing our total turnover since our inception to over USD 7.1 billion.')}
                image='chart-turnover'
            />
            {/* <Numbers
                className='withdrawal'
                header={it.L('Client withdrawals')}
                text={it.L('Client withdrawals prior to this year amounted to almost USD 500 million. More than USD 140 million worth of client withdrawals is expected this year.')}
                image='chart-client-withdrawals'
            /> */}
            <Numbers
                className='employee'
                header={it.L('Number of employees and contractors')}
                text={it.L('We\'ve grown over the years - both in human resources and offices. Currently, [_1] employees are spread across four offices in Malaysia, Malta, Paraguay and the UAE. We\'re expecting to expand even more to support the demand for our products and services.', '250')}
                image='chart-num-employees'
            />
        </div>
    </React.Fragment>

);

export default BinaryInNumbers;
