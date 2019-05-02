import React from 'react';

const TradingDurations = () => (
    <div id='trading_durations' className='trading-durations'>
        <h1 className='trading-durations__title'>{it.L('Trading Durations')}</h1>
        <div className='gr-padding-10 trading-durations__wrapper'>
            <p id='errorMsg' className='trading-durations__error-msg invisible' />
            <div className='gr-parent trading-durations__content'>
                <ul id='trading_duration_tabs' className='trading-durations__tabs'>
                    {/*
                        loop through the market array showing display name
                        and name as id to navigate on the market trading durations
                    */}
                    {/* ARRAY LOOP BEGIN */ }
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
                <div id='trading_durations_data' />
            </div>
            <p className='notice-msg center-text invisible' id='empty-trading-durations'>
                {it.L('Trading durations is unavailable in this country. If you have an active [_1] account, please [_2]log in[_3] for full access.', it.website_name, '<a id=\'empty-trading-durations-btn-login\' href=\'javascript:;\'>', '</a>')}
            </p>
        </div>
    </div>
);

export default TradingDurations;
