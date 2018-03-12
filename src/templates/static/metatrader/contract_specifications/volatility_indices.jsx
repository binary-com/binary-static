import React from 'react';
import { Table } from '../../../_common/components/elements.jsx';

const VolatilityIndices = () => {
    const usd            = { text: it.L('USD 1 per point') };
    const txt_01         = { text: '0.01' };
    const percentage     = { text: '0.2%' };
    const high_frequency = it.L('High frequency (2 ticks per second)');

    return (
        <div id='volatility_specs' className='gr-row'>
            <div className='gr-12 gr-padding-10'>
                <Table
                    scroll
                    data={{
                        thead: [
                            [
                                { text: it.L('Symbol') },
                                { text: it.L('Volume 1.0 (Trade Size)') },
                                { text: it.L('Minimum Volume (Trade Size)') },
                                { text: it.L('Minimum Volume Increment') },
                                { text: it.L('Pip Size') },
                                { text: it.L('Minimum Spread') },
                                { text: it.L('Margin') },
                            ],
                        ],
                        tbody: [
                            [{ header: 'Volatility 100 Index'                             }, usd, { text: '0.01' }, txt_01, { text: '0.01' },   { text: '0.025%' }, percentage ],
                            [{ header: 'Volatility 75 Index'                              }, usd, { text: '0.01' }, txt_01, { text: '0.0001' }, { text: '0.018%' }, percentage ],
                            [{ header: 'Volatility 50 Index'                              }, usd, { text: '0.5' },  txt_01, { text: '0.0001' }, { text: '0.012%' }, percentage ],
                            [{ header: 'Volatility 25 Index'                              }, usd, { text: '0.5' },  txt_01, { text: '0.001' },  { text: '0.006%' }, percentage ],
                            [{ header: 'Volatility 10 Index'                              }, usd, { text: '0.1' },  txt_01, { text: '0.001' },  { text: '0.025%' }, percentage ],
                            [{ header: 'HF Volatility 100 Index', balloon: high_frequency }, usd, { text: '0.3' },  txt_01, { text: '0.001' },  { text: '0.012%' }, percentage ],
                            [{ header: 'HF Volatility 50 Index',  balloon: high_frequency }, usd, { text: '0.5' },  txt_01, { text: '0.001' },  { text: '0.012%' }, percentage ],
                            [{ header: 'HF Volatility 10 Index',  balloon: high_frequency }, usd, { text: '0.1' },  txt_01, { text: '0.001' },  { text: '0.005%' }, percentage ],
                        ],
                    }}
                />
            </div>

            <div className='gr-12 gr-padding-10'>
                <h2>{it.L('How to read the table above')}</h2>
                <p>{it.L('CFD (Contract for Difference): CFD is an instrument that allows you to profit by speculating on the rise or fall of an instrument. The profit/loss is estimated as a function of the difference in the buy/sell prices of the underlying instrument.')}</p>
                <p>{it.L('For example, the CFDs on Volatility Indices offer a USD 1 per point contract. If you buy a Volume 1.0 contract for the Volatility 100 Index with current ask price of USD 20,000 and later sell it at a bid price of USD 20,010, your net profit will be calculated as follows:')}</p>
                <div className='gr-12 gr-padding-10 fill-bg-color'>
                    <div className='gr-prefix-1'>
                        <p>{it.L('(Sell Price - Buy Price) x Volume x Price Per Point = Profit')}</p>
                        <p>{it.L('I.e. (20010 - 20000) x 1 x 1 = USD 10')}</p>
                    </div>
                </div>
                <p>{it.L('Each time you open a position on a Volatility Index symbol, you can start with a minimum volume transaction of 0.01 (trade size), which translates to USD 0.01 per point movement of the index.')}</p>
                <p>{it.L('Margin indicates how much investment you can control based on your initial capital. For example, a 0.2% margin will allow you to control up to USD 500,000 using only USD 1,000 of your own money as deposit.')}</p>
                <p>{it.L('To learn more, read our <a href="[_1]">CFD Margin Policy</a> that further explains our 50% forced liquidation level for Volatility Indices.', it.url_for('get-started/cfds#margin-policy'))}</p>
            </div>
        </div>
    );
};

export default VolatilityIndices;
