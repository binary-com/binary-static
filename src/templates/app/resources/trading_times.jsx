import React from 'react';

const TradingTimes = () => (
    <React.Fragment>
        <h1>{it.L('Trading Times')}</h1>
        <p>
            <label htmlFor='trading-date'>{it.L('Date')}: </label>
            <input type='text' id='trading-date' readOnly='readonly' size='20' />
        </p>
        <p>{it.L('All times are in GMT (Greenwich Mean Time).')}</p>

        <div className='gr-padding-10'>
            <p className='error-msg invisible' id='errorMsg' />
            <div id='trading-times' className='has-tabs gr-parent' />
        </div>
    </React.Fragment>
);

export default TradingTimes;
