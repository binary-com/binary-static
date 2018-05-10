import React from 'react';
import Loading from '../../_common/components/loading.jsx';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const EconomicCalendar = () => (
    <div id='economic_calendar' className='static_full'>
        <div className='economic-calendar-header'>
            <h1>{it.L('Economic Calendar')}</h1>
            <p>{it.L('Check out the latest economic events and indicators from all over the world. All data are collected and updated in real time.')}</p>
            <p>{it.L('You can monitor macroeconomic indicators straight from the MetaTrader 5 platform using release time labels displayed on [_1]financial symbol charts[_2].', '<a href="https://www.metatrader5.com/en/terminal/help/fundamental#chart" target="_blank" rel="noopener">','</a>')}</p>
            <p>{it.L('With the Economic Calendar, you can see a breakdown of all the scheduled economic events due to take place on any given day.')}</p>
            <p>{it.L('Click on an individual event to be presented with further information and links to more in-depth data about it. The information provided by the Economic  Calendar will help you make more informed trading decisions.')}</p>
        </div>
        <div className='gr-padding-10'>
            <div id='economicCalendarWidget'>
                <Loading />
            </div>
        </div>
        <p className='hint'>
            * {it.L('Disclaimer: The Economic Calendar tool is a third-party application developed by MetaQuotes Software Corp. and its data can change without prior notice. [_1] is not responsible for the content or accuracy of its data, or for any loss or damage of any sort resulting from its data.', it.website_name)}
        </p>
        <SeparatorLine className='gr-padding-10' invisible />
    </div>
);
export default EconomicCalendar;
