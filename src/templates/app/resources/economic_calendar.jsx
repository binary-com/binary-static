import React from 'react';
import Loading from '../../_common/components/loading.jsx';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const EconomicCalendar = () => (
    <div id='economic_calendar' className='static_full'>
        <h1>{it.L('Economic Calendar')}</h1>
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
