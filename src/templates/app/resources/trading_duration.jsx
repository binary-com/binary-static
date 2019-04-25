import React from 'react';

const TradingDurations = () => (
    <div className='trading-durations'>
        <h1 className='trading-durations__title'>{it.L('Trading Durations')}</h1>
        <div className='gr-padding-10 trading-durations__wrapper'>
            <p id='errorMsg' className='trading-durations__error-msg invisible' />
            <div id='trading-durations' className='gr-parent trading-durations__content'>
                <ul className='trading-durations__tabs'>
                    <li>Forex</li>
                    <li>Indices</li>
                    <li>Commodities</li>
                    <li>Volatility Indices</li>
                </ul>
                <h2>Major Pairs</h2>
                <table className='trading-durations__table'>
                    <thead>
                        <tr>
                            <th rowSpan='2'>Underlying Assets</th>
                            <th rowSpan='2'>Trade Type</th>
                            <th colSpan='5'>Duration Type</th>
                        </tr>
                        <tr>
                            <td className='trading-durations__table--ticks'>Ticks</td>
                            <td>Seconds</td>
                            <td>Minutes</td>
                            <td>Hours</td>
                            <td>Days</td>
                        </tr>
                    </thead>
                    <tbody>
                        <td className='trading-durations__table--assets'>
                            <div className='trading-durations__table--assets-content'>
                                ASSETS
                            </div>
                        </td>
                        <tr>
                            <td>trade/type</td>
                            <td>durationtick</td>
                            <td>durationmin</td>
                            <td>durationhour</td>
                            <td>durationday</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className='notice-msg center-text invisible' id='empty-trading-durations'>
                {it.L('Trading durations is unavailable in this country. If you have an active [_1] account, please [_2]log in[_3] for full access.', it.website_name, '<a id=\'empty-trading-durations-btn-login\' href=\'javascript:;\'>', '</a>')}
            </p>
        </div>
    </div>
);

export default TradingDurations;
