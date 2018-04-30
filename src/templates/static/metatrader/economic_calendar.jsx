import React from 'react';

const EconomicCalendar = () => (
    <div id='economic_calendar' className='static_full'>
        <div className='economic-calendar-header gr-row'>
            <div className='gr-12 gr-centered'>
                <h1>{it.L('Economic Calendar')}</h1>
                <p>{it.L('Check out the latest economic events and indicators from all over the world. All data are collected and updated in real time.')}</p>
            </div>
        </div>
        <div className='gr-12 gr-centered'>
            <p>{it.L('You can monitor macroeconomic indicators straight from the MetaTrader 5 platform using release time labels displayed on [_1]financial symbol charts[_2].', '<a href="https://www.metatrader5.com/en/terminal/help/fundamental#chart" target="_blank">','</a>')}</p>
            <p>{it.L('With the Economic Calendar, you can see a breakdown of all the scheduled economic events due to take place on any given day.')}</p>
            <p>{it.L('Click on an individual event to be presented with further information and links to more in-depth data about it. The information provided by the Economic  Calendar will help you make more informed trading decisions.')}</p>
        </div>
        <div className='gr-12 gr-centered gr-padding-20'>
            <div id='economicCalendarWidget' />
        </div>
    </div>
);
export default EconomicCalendar;
