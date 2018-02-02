import React from 'react';
import { List, Table } from '../../../_common/components/elements.jsx';

const Metals = () => (
    <div id='metals_specs' className='gr-row'>
        <div className='gr-12 gr-padding-10'>
            <Table
                scroll
                data={{
                    thead: [
                        [
                            { text: it.L('Symbol') },
                            { text: it.L('Description') },
                            { text: it.L('Volume 1.0<br>(Lot Size)') },
                            { text: it.L('Min. Volume<br>(Lot Size)') },
                            { text: it.L('Min. Volume Increment') },
                        ],
                    ],
                    tbody: [
                        [{ text: 'XAU/USD' }, { text: it.L('Gold vs US Dollar') },      { text: '100' },  { text: '0.01' }, { text: '0.01' }],
                        [{ text: 'XAG/USD' }, { text: it.L('Silver vs US Dollar') },    { text: '5000' }, { text: '0.01' }, { text: '0.01' }],
                        [{ text: 'XPD/USD' }, { text: it.L('Palladium vs US Dollar') }, { text: '100' },  { text: '0.01' }, { text: '0.01' }],
                        [{ text: 'XPT/USD' }, { text: it.L('Platinum vs US Dollar') },  { text: '100' },  { text: '0.01' }, { text: '0.01' }],
                    ],
                }}
            />
        </div>

        <div className='gr-4 gr-push-4 gr-8-p gr-push-2-p gr-12-m gr-push-0-m gr-padding-30'>
            <div className='fill-bg-color gr-padding-10'>
                <div className='gr-prefix-1'>
                    <h2>{it.L('Maximum Leverage')}</h2>
                    <List
                        className='bullet'
                        items={[
                            { text: it.L('Standard account: 1:500') },
                            { text: it.L('Advanced account: 1:100') },
                            { text: it.L('Volatility Indices account: 1:500') },
                        ]}
                    />
                </div>
            </div>
        </div>

        <div className='gr-12 gr-padding-10'>
            <h2>{it.L('How to read the table above')}</h2>
            <p>{it.L('Our metal pairs are typically traded in lots. One standard lot is equivalent to 100 units except silver where 1 lot equals 5.000 units. Each time you open a position on a symbol, you can start with a minimum transaction of 0.01 lots.')}</p>
            <p>{it.L('Leverage indicates how much capital you can control based on your initial deposit. For example, a 1:100 leverage will allow you to control up to USD 100,000 using only USD 1,000 of your own money as deposit.')}</p>
            <p>{it.L('To learn more, read our <a href="[_1]">Metals Margin Policy</a> that further explains our 100% forced liquidation level for our metal pairs.', it.url_for('get-started/metals#margin-policy'))}</p>

            <h2>{it.L('Important notes on our swap rates (overnight funding)')}</h2>
            <p>{it.L('If you keep any positions open overnight, an interest adjustment will be made to your trading account as indication of the cost required to keep your position open. This adjustment is based on interbank lending rates, on top of a 2% fee.')}</p>
            <p>{it.L('The interest adjustment is calculated in points, meaning we will convert the relevant market rates to points in the base instrument.')}</p>
            <p>{it.L('The swap rate will depend on the direction of the position you take:')}</p>
            <div className='gr-prefix-1'>
                <ul className='bullet'>
                    <li><strong>{it.L('Long positions')}</strong>: {it.L('We charge a 2% fee on top of market rates.')}</li>
                    <li><strong>{it.L('Short positions')}</strong>: {it.L('We charge a 2% fee on top of market rates.')}</li>
                </ul>
            </div>
            <p>{it.L('Please take note that our swap rate also depends on the time and days you hold your positions open: ')}</p>
            <div className='gr-prefix-1'>
                <ul className='bullet'>
                    <li>{it.L('You will be subjected to swap rates if you keep a position open past the market close.')}</li>
                    <li>{it.L('Positions that are still open on Friday at market close will be charged three times the swap rate to account for weekends, a standard practice for all brokers.')}</li>
                    <li>{it.L('Our swap rate may also be adjusted to take holidays into account.')}</li>
                </ul>
            </div>
        </div>
    </div>
);

export default Metals;
