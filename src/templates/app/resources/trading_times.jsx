import React from 'react';

const TradingTimes = () => (
    <React.Fragment>
        <h1>{it.L('Trading Times')}</h1>
        <p id='trading-date-container'>
            <label htmlFor='trading-date'>{it.L('Date')}: </label>
            <input type='text' id='trading-date' readOnly='readonly' size='20' />
        </p>
        <p id='trading-date-notice'>{it.L('All times are in GMT (Greenwich Mean Time).')}</p>

        <div className='gr-padding-10'>
            <p className='error-msg invisible' id='errorMsg' />
            <div id='trading-times' className='has-tabs gr-parent' />
            <p className='notice-msg center-text invisible' id='empty-trading-times'>
                {it.L('Trading times is unavailable in this country. If you have an active [_1] account, please log in for full access.', it.website_name)}
            </p>
        </div>
    </React.Fragment>
);

export default TradingTimes;
