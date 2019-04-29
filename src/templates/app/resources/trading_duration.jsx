import React from 'react';

const TradingDurations = () => (
    <div className='trading-durations'>
        <h1 className='trading-durations__title'>{it.L('Trading Durations')}</h1>
        <div className='gr-padding-10 trading-durations__wrapper'>
            <p id='errorMsg' className='trading-durations__error-msg invisible' />
            <div className='gr-parent trading-durations__content'>
                <ul className='trading-durations__tabs'>
                    {/*
                        loop through the market array showing display name
                        and name as id to navigate on the market trading durations
                    */}
                    {/* ARRAY LOOP BEGIN */ }
                    <li>Forex</li> {/* array.market.display_name */ }
                    <li>Indices</li>
                    <li>Commodities</li>
                    <li>Volatility Indices</li>
                </ul>
                {/*
                    the array structure for this will be
                    [{
                        market: { name: 'forex', display_name: localize('Forex') },
                        submarket: { name: 'minor_pair', display_name: localize('Minor Pair') },
                        data: [    #basically data is an array of objects with 'symbols' and 'trade_durations' as its properties
                            {
                            symbols: [ { name: 'frxAUDJPY', display_name: localize('AUD/JPY') }, { name: 'frxAUDUSD', display_name: localize('AUD/USD') }, ... ],
                            trade_durations: [
                                {
                                    trade_type: { name: 'rise_fall', display_name: localize('Rise/Fall') },
                                    durations : [
                                        {name: ticks, display_name: localize('ticks'), min: 1, max: 10 }, ...
                                    ]
                                },
                            ...]
                            },
                        ],

                    }, ...]
                */}
                {/* ARRAY LOOP BEGIN */ }
                <div id='market_name'> {/* id=array.market.name */}
                    <div id='submarket_name'> {/* id=array.submarket.name */}
                        <h3>Major Pairs</h3> {/* array.submarket.display_name */}
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
                                {/* Loop array.data */}
                                <tr>
                                    <th rowSpan='5' className='trading-durations__table--assets'> {/* rowspan=array.symbols.length */}
                                        {/* Loop array.symbols */}
                                        ASSETS
                                        {/* array.symbols.display_name */}
                                        <br />
                                    </th>
                                </tr>
                                {/* Loop array.trade_durations */}
                                <tr>
                                    <td>trade/type</td> {/* array.trade_durations.trade_type.display_name */}
                                    {/* Loop array.trade_durations.durations */}
                                    <td>durationtick</td>
                                    {/* array.trade_durations.durations.name === tick ?
                                        `${array.trade_durations.durations.min} - ${array.trade_durations.durations.max}
                                        : -` */}
                                    <td>durationsecond</td>
                                    {/* array.trade_durations.durations.name === tick ?
                                        `${array.trade_durations.durations.min} - ${array.trade_durations.durations.max}
                                        : -` */}
                                    <td>durationmin</td>
                                    {/* array.trade_durations.durations.name === tick ?
                                        `${array.trade_durations.durations.min} - ${array.trade_durations.durations.max}
                                        : -` */}
                                    <td>durationhour</td>
                                    {/* array.trade_durations.durations.name === tick ?
                                        `${array.trade_durations.durations.min} - ${array.trade_durations.durations.max}
                                        : -` */}
                                    <td>durationday</td>
                                    {/* array.trade_durations.durations.name === tick ?
                                        `${array.trade_durations.durations.min} - ${array.trade_durations.durations.max}
                                        : -` */}
                                </tr>
                                <tr>
                                    <td>trade/type</td>
                                    <td>durationtick</td>
                                    <td>durationsecond</td>
                                    <td>durationmin</td>
                                    <td>durationhour</td>
                                    <td>durationday</td>
                                </tr>
                                <tr>
                                    <td>trade/type</td>
                                    <td>durationtick</td>
                                    <td>durationsecond</td>
                                    <td>durationmin</td>
                                    <td>durationhour</td>
                                    <td>durationday</td>
                                </tr>
                                <tr>
                                    <td>trade/type</td>
                                    <td>durationtick</td>
                                    <td>durationsecond</td>
                                    <td>durationmin</td>
                                    <td>durationhour</td>
                                    <td>durationday</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <p className='notice-msg center-text invisible' id='empty-trading-durations'>
                {it.L('Trading durations is unavailable in this country. If you have an active [_1] account, please [_2]log in[_3] for full access.', it.website_name, '<a id=\'empty-trading-durations-btn-login\' href=\'javascript:;\'>', '</a>')}
            </p>
        </div>
    </div>
);

export default TradingDurations;
