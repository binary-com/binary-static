import React from 'react';

const BinaryInNumbers = () => (
  <React.Fragment>
        <div className='gr-padding-10 static_full'>
            <h1 className='center-text'>{it.L('[_1] in Numbers', it.website_name)}</h1>
            <p className='center-text'>{it.L('In business since 2000, [_1] is the world’s leading binary options company.', it.website_name)}</p>
        </div>
        <div className='stacked-charts'>
            <div className='client'>
                <span className='icon'></span>
                <div className='inner center-text'>
                    <h2>{it.L('Active trading clients')}</h2>
                    <p>{it.L('[_1]’s number of active clients has risen nearly 5-fold in the last 5 years.', it.website_name)}</p>
                    <img className='chart' src={it.url_for('images/pages/binary_in_numbers/charts/chart-active-trading-clients.svg')}></img>
                </div>
            </div>
            <div className='transaction'>
                <span className='icon'></span>
                <div className='inner center-text'>
                    <h2>{it.L('Number of transactions')}</h2>
                    <p>{it.L('In last two years alone, over 276 million contracts were bought and sold on our platform.')}</p>
                    <img className='chart' src={it.url_for('images/pages/binary_in_numbers/charts/chart-num-transactions.svg')}></img>
                </div>
            </div>
            <div className='turnover'>
                <span className='icon'></span>
                <div className='inner center-text'>
                    <h2>{it.L('Turnover')}</h2>
                    <p>{it.L('We\'ve generated over USD 3 billion in turnover since inception, thanks to a rapid growth in business from 2010 onwards.')}</p>
                    <img className='chart' src={it.url_for('images/pages/binary_in_numbers/charts/chart-turnover.svg')}></img>
                </div>
            </div>
            <div className='withdrawal'>
                <span className='icon'></span>
                <div className='inner center-text'>
                    <h2>{it.L('Client withdrawals')}</h2>
                    <p>{it.L('Client withdrawals have grown nearly 8-fold over the last 5 years, to nearly USD 120 million.')}</p>
                    <img className='chart' src={it.url_for('images/pages/binary_in_numbers/charts/chart-client-withdrawals.svg')}></img>
                </div>
            </div>
            <div className='employee'>
                <span className='icon'></span>
                <div className='inner center-text'>
                    <h2>{it.L('Number of employees and contractors')}</h2>
                    <p>{it.L('We\'ve grown in size over the years -- both in terms of manpower and offices. We currently have over 130 employees across four offices in three countries: Malaysia, Malta and Japan.')}</p>
                    <img className='chart' src={it.url_for('images/pages/binary_in_numbers/charts/chart-num-employees.svg')}></img>
                </div>
            </div>
        </div>
    </React.Fragment>

);

export default BinaryInNumbers;
