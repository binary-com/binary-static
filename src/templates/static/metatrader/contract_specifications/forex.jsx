import React from 'react';
import { Table } from '../../../_common/components/elements.jsx';

const Forex = () => {
    const txt_100000 = { text: '100,000' };
    const txt_01     = { text: '0.01' };
    const txt_500   =  { text: '500:1' };
    const txt_5000   = { text: '5000' };
    const txt_100    = { text: '100' };

    return (
        <div id='forex_specs' className='gr-row'>
            <div className='gr-12 gr-padding-10'>
                <Table
                    scroll
                    data={{
                        thead: [
                            [
                                { text: it.L('Currency Symbol') },
                                { text: it.L('Lot Size (Volume = 1.0)') },
                                { text: it.L('Minimum Volume') },
                                { text: it.L('Minimum Volume Increment') },
                                { text: it.L('Maximum Leverage') },
                            ],
                        ],
                        tbody: [
                            [{ text: 'EUR/USD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'GBP/USD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'USD/CHF' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'USD/JPY' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'USD/CAD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'AUD/USD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'AUD/NZD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'AUD/CAD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'AUD/CHF' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'AUD/JPY' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'EUR/GBP' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'EUR/AUD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'EUR/CHF' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'EUR/JPY' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'EUR/JPY' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'EUR/NZD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'EUR/CAD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'GBP/CHF' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'GBP/JPY' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'NZD/USD' }, txt_100000, txt_01, txt_01, txt_500 ],
                            [{ text: 'XAGUSD' },  txt_5000,   txt_01, txt_01, txt_500 ],
                            [{ text: 'XAUUSD' },  txt_100,    txt_01, txt_01, txt_500 ],
                            [{ text: 'XPDUSD' },  txt_100,    txt_01, txt_01, txt_500 ],
                            [{ text: 'XPTUSD' },  txt_100,    txt_01, txt_01, txt_500 ],
                        ],
                    }}
                />
            </div>

            <div className='gr-12 gr-padding-10'>
                <h2>{it.L('How to read the table above')}</h2>
                <p>{it.L('The Forex is typically traded in <i>lots</i>. One standard <i>lots</i> is equivalent to 100,000 units. Each time you open a position on a currency symbol, you can start with a minimum transaction of <i>0.01 lots</i>.')}</p>
                <p>{it.L('Leverage indicates how much capital you can control based on your initial deposit. For example, a 100:1 leverage will allow you to control up to USD 100,000 using only USD 1,000 of your own money as deposit.')}</p>
                <p>{it.L('To learn more, read our <a href="[_1]">Forex Margin Policy</a> that further explains our 100% forced liquidation level for Forex.', it.url_for('get-started/forex#margin-policy'))}</p>

                <h2>{it.L('Important notes on our swap rates (overnight funding)')}</h2>
                <p>{it.L('If you keep any positions open overnight, an interest adjustment will be made to your trading account as indication of the cost required to keep your position open. This adjustment is based on interbank lending rates, on top of a 2% fee.')}</p>
                <p>{it.L('The interest adjustment is calculated in points, meaning we will convert the relevant interbank lending rates to points in the base currency.')}</p>
                <p>{it.L('The swap rate will depend on the direction of the position you take:')}</p>
                <div className='gr-prefix-1'>
                    <ul className='bullet'>
                        <li>{it.L('<strong>Long positions</strong>: We charge a 2% fee on top of interbank lending rates.')}
                            <span data-balloon-length='large' data-balloon={it.L('Let\'s say the points adjustment for a long position on the EUR/USD symbol is -5.64. This would require an overnight fee of 5.64 points for one lot of open position in EUR/USD, where the size of one lot is 100,000 units. The points will then be converted into the deposit currency (which is the euro in this example). As a result, you will incur an interest fee of EUR5.64 for keeping the position open overnight.')}>
                                {it.L('How do we calculate interest fees for long positions?')}
                            </span>
                        </li>
                        <li>{it.L('<strong>Short positions</strong>: We charge a 2% fee on top of interbank lending rates.')}
                            <span data-balloon-length='large' data-balloon={it.L('Let\'s say the points adjustment for a short position on the EUR/USD symbol is 1.64. This would result in an overnight credit of 1.64 points for one lot of open position in EUR/USD where the size of one lot is 100,000 units. The points will then be converted into the deposit currency (which is the euro in this example). As a result, you will be credited with EUR1.64 for keeping the position open overnight.')}>
                                {it.L('How do we calculate interest fees for short positions?')}
                            </span>
                        </li>
                    </ul>
                </div>
                <p>{it.L('Please take note that our swap rate also depends on the time and days you hold your positions open: ')}</p>
                <div className='gr-prefix-1'>
                    <ul className='bullet'>
                        <li>{it.L('You will be subjected to swap rates if you keep a position open past 23:59:59 GMT.')}</li>
                        <li>{it.L('Positions that are still open on Wednesday at 23:59:59 GMT will be charged three times the swap rate to account for weekends, a standard practice for all Forex brokers.')}</li>
                        <li>{it.L('Our swap rate may also be adjusted to take holidays into account.')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Forex;
