import React from 'react';

const Explanation = () => (
    <div className='gr-parent'>
        {/* ========== Winning ========== */}
        <div id='explanation_winning' className='invisible'>

            <div id='winning_asian' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('Asian options settle by comparing the <strong>last tick</strong> with the average spot over the period.')}</p>
                <p>{it.L('If you select "Asian Rise", you will win the payout if the <strong>last tick</strong> is <strong>higher</strong> than the <strong>average</strong> of the ticks.')}</p>
                <p>{it.L('If you select "Asian Fall", you will win the payout if the <strong>last tick</strong> is <strong>lower</strong> than the <strong>average</strong> of the ticks.')}</p>
            </div>

            <div id='winning_digits' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "Matches", you will win the payout if the <strong>last digit</strong> of the last tick is the <strong>same</strong> as your <strong>prediction.</strong>')}</p>
                <p>{it.L('If you select "Differs", you will win the payout if the <strong>last digit</strong> of the last tick is <strong>not the same</strong> as your <strong>prediction</strong>.')}</p>
            </div>

            <div id='winning_endsinout' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "Ends Between", you win the payout if the <strong>exit spot</strong> is strictly higher than the <strong>Low barrier</strong> AND strictly lower than the <strong>High barrier</strong>.')}</p>
                <p>{it.L('If you select "Ends Outside", you win the payout if the <strong>exit spot</strong> is EITHER strictly higher than the <strong>High barrier</strong>, OR strictly lower than the <strong>Low barrier</strong>.')}</p>
            </div>

            <div id='winning_evenodd' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "Even", you will win the payout if the <strong>last digit</strong> of the last tick is an <strong>even number (i.e., 2, 4, 6, 8, or 0).</strong>')}</p>
                <p>{it.L('If you select "Odd", you will win the payout if the <strong>last digit</strong> of the last tick is an <strong>odd number (i.e., 1, 3, 5, 7, or 9).</strong>')}</p>
            </div>

            <div id='winning_higherlower' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "Higher", you win the payout if the <strong>exit spot</strong> is strictly higher than the <strong>barrier</strong>.')}</p>
                <p>{it.L('If you select "Lower", you win the payout if the <strong>exit spot</strong> is strictly lower than the <strong>barrier</strong>.')}</p>
            </div>

            <div id='winning_overunder' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "Over", you will win the payout if the <strong>last digit</strong> of the last tick is <strong>greater than your prediction.</strong>')}</p>
                <p>{it.L('If you select "Under", you will win the payout if the <strong>last digit</strong> of the last tick is <strong>less than your prediction.</strong>')}</p>
            </div>

            <div id='winning_risefall' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "Rises", you win the payout if the <strong>exit spot</strong> is strictly higher than the <strong>entry spot</strong>.')}</p>
                <p>{it.L('If you select "Falls", you win the payout if the <strong>exit spot</strong> is strictly lower than the <strong>entry spot</strong>.')}</p>
            </div>

            <div id='winning_runbet-lucky10' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('You win the payout if the market price ends in the digit you have selected.')}</p>
            </div>

            <div id='winning_runbet-quick10' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('You win the payout if the market price does not end in the digit you have selected.')}</p>
            </div>

            <div id='winning_runbet-updown' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "rises", you win the payout if the market price is higher than the <strong>entry spot</strong>.')}</p>
                <p>{it.L('If you select "falls", you win the payout if the market price is lower than the <strong>entry spot</strong>.')}</p>
            </div>

            <div id='winning_staysinout' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "Stays Between", you win the payout if the market stays between (does not touch) either the <strong>High barrier</strong> or the <strong>Low barrier</strong> at any time during the <strong>contract period</strong>.')}</p>
                <p>{it.L('If you select "Goes Outside", you win the payout if the market touches either the <strong>High barrier</strong> or the <strong>Low barrier</strong> at any time during the <strong>contract period</strong>.')}</p>
            </div>

            <div id='winning_ticks' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "Rises", you win the payout if the <strong>exit spot</strong> is strictly higher than the <strong>entry spot</strong>.')}</p>
                <p>{it.L('If you select "Falls", you win the payout if the <strong>exit spot</strong> is strictly lower than the <strong>entry spot</strong>.')}</p>
            </div>

            <div id='winning_touchnotouch' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "Touches", you win the payout if the market touches the <strong>barrier</strong> at any time during the <strong>contract period</strong>.')}</p>
                <p>{it.L('If you select "Does Not Touch", you win the payout if the market never touches the <strong>barrier</strong> at any time during the <strong>contract period</strong>.')}</p>
            </div>

            <div id='winning_updown' className='invisible'>
                <h3>{it.L('Winning the contract')}</h3>
                <p>{it.L('If you select "rises", you win the payout if the market price is higher than the entry spot.')}</p>
                <p>{it.L('If you select "falls", you win the payout if the market price is lower than the entry spot.')}</p>
            </div>
            <div id='winning_lookbacklow' className='invisible'>
                <h3>{it.L('Pay-out')}</h3>
                <p>{it.L('By purchasing the [_1]‘Close-Low’[_2] contract, you’ll win the multiplier times the difference between the [_1]close[_2] and [_1]low[_2] over the duration of the contract.', '<strong>', '</strong>')}</p>
            </div>
            <div id='winning_lookbackhigh' className='invisible'>
                <h3>{it.L('Pay-out')}</h3>
                <p>{it.L('By purchasing the [_1]‘High-Close’[_2] contract, you’ll win the multiplier times the difference between the [_1]high[_2] and [_1]close[_2] over the duration of the contract.', '<strong>', '</strong>')}</p>
            </div>
            <div id='winning_lookbackhighlow' className='invisible'>
                <h3>{it.L('Pay-out')}</h3>
                <p>{it.L('By purchasing the [_1]‘High-Low’[_2] contract, you’ll win the multiplier times the difference between the [_1]high[_2] and [_1]low[_2] over the duration of the contract.', '<strong>', '</strong>')}</p>
            </div>
        </div>

        {/* ========== Image ========== */}
        <div id='explanation_image' className='invisible'>
            <div className='gr-row'>
                <div className='gr-2 hide-mobile' />
                <div className='gr-4 gr-12-m padding-right' style={{margin: 'auto'}}>
                    <img id='explanation_image_1' className='responsive' />
                </div>
                <div className='gr-4 gr-12-m padding-left'>
                    <img id='explanation_image_2' className='responsive' />
                </div>
                <div className='gr-2 hide-mobile' />
            </div>
        </div>

        {/* ========== Explain ========== */}
        <div id='explanation_explain' className='invisible gr-padding-20 gr-child'>
            <div id='explain_asian' className='invisible'>
                <h3>{it.L('The First Tick')}</h3>
                <p>{it.L('The first tick is the first tick after the contract is processed by our servers.')}</p>
                <h3>{it.L('The Average')}</h3>
                <p>{it.L('The average is the average of the ticks, including the first and the last tick.')}</p>
                <p className='hint'><strong>{it.L('Note')}: </strong>{it.L('Asian contracts will be refunded at the purchase price if the contract doesn\'t end within 5 minutes.')}</p>
            </div>

            <div id='explain_digits' className='invisible'>
                <h3>{it.L('The First Tick')}</h3>
                <p>{it.L('The first tick is the first tick after the contract is processed by our servers.')}</p>
                <p className='hint'><strong>{it.L('Note')}: </strong>{it.L('Digit contracts will be refunded at the purchase price if the contract doesn\'t end within 5 minutes.')}</p>
            </div>

            <div id='explain_endsinout' className='invisible'>
                <h3>{it.L('Exit spot')}</h3>
                <p>{it.L('The <strong>exit spot</strong> is the latest tick at or before the <strong>end time</strong>.')}</p>
                <p>{it.L('The <strong>end time</strong> is the selected number of minutes/hours after the <strong>start time</strong> (if less than one day in duration), or at the end of the trading day (if one day or more in duration).')}</p>
                <p>{it.L('The <strong>start time</strong> is when the contract is processed by our servers.')}</p>
                <p className='hint'><strong>{it.L('Note')}: </strong>{it.L('Ends Between/Ends Outside contracts will be refunded at the purchase price if there are less than 2 ticks between the start and end times.')}</p>
            </div>

            <div id='explain_evenodd' className='invisible'>
                <h3>{it.L('The First Tick')}</h3>
                <p>{it.L('The first tick is the first tick after the contract is processed by our servers.')}</p>
                <p className='hint'><strong>{it.L('Note')}: </strong>{it.L('Even/Odd contracts will be refunded at the purchase price if the contract doesn\'t end within 5 minutes.')}</p>
            </div>

            <div id='explain_higherlower' className='invisible'>
                <h3>{it.L('Exit spot')}</h3>
                <p>{it.L('The <strong>exit spot</strong> is the latest tick at or before the <strong>end time</strong>.')}</p>
                <p>{it.L('The <strong>end time</strong> is the selected number of minutes/hours after the <strong>start time</strong> (if less than one day in duration), or at the end of the trading day (if one day or more in duration).')}</p>
                <p>{it.L('The <strong>start time</strong> is when the contract is processed by our servers.')}</p>
                <p className='hint'><strong>{it.L('Note')}: </strong>{it.L('Higher/Lower contracts will be refunded at the purchase price if there are less than 2 ticks between the start and end times.')}</p>
            </div>

            <div id='explain_overunder' className='invisible'>
                <h3>{it.L('The First Tick')}</h3>
                <p>{it.L('The first tick is the first tick after the contract is processed by our servers.')}</p>
                <p className='hint'><strong>{it.L('Note')}: </strong>{it.L('Over/Under contracts will be refunded at the purchase price if the contract doesn\'t end within 5 minutes.')}</p>
            </div>

            <div id='explain_risefall' className='invisible'>
                <h3>{it.L('Entry spot')}</h3>
                <p>
                    {it.L('If you select a <strong>start time</strong> of "Now", the <strong>start time</strong> is when the contract is processed by our servers and the <strong>entry spot</strong> is the <strong>next tick</strong> thereafter.')}
                    <br />
                    {it.L('If you select a <strong>start time</strong> in the future, the <strong>start time</strong> is that which is selected and the <strong>entry spot</strong> is the price in effect at that time.')}
                </p>
                <br />
                <h3>{it.L('Exit spot')}</h3>
                <p>
                    {it.L('The <strong>exit spot</strong> is the latest tick at or before the <strong>end time</strong>.')}
                    <br />
                    {it.L('If you select a <strong>start time</strong> of "Now", the <strong>end time</strong> is the selected number of minutes/hours after the <strong>start time</strong> (if less than one day in duration), or at the end of the trading day (if one day or more in duration).')}
                    <br />
                    {it.L('If you select a specific <strong>end time</strong>, the <strong>end time</strong> is the selected time.')}
                </p>
                <br />
                <p className='hint'><strong>{it.L('Note')}: </strong>{it.L('Rise/Fall contracts will be refunded at the purchase price if the following conditions occur: (1) there are less than 2 ticks between the start and end times, or (2) for contracts of tick duration, if the contract doesn\'t end within 5 minutes, or (3) for contracts starting in the future, if there are no ticks in the 5 minutes before the contract\'s start time.')}</p>
            </div>

            <div id='explain_staysinout' className='invisible'>
                <h3>{it.L('Contract period')}</h3>
                <p>{it.L('The <strong>contract period</strong> is the period between the <strong>next tick</strong> after the <strong>start time</strong> and the <strong>end time</strong>.')}</p>
                <p>{it.L('The <strong>start time</strong> is when the contract is processed by our servers.')}</p>
                <p>{it.L('The <strong>end time</strong> is the selected number of minutes/hours after the <strong>start time</strong> (if less than one day in duration), or at the end of the trading day (if one day or more in duration).')}</p>
                <p className='hint'><strong>{it.L('Note')}: </strong>{it.L('Stays Between/Goes Outside Contracts will be refunded at the purchase price if there are less than 2 ticks between the start and end times.')}</p>
            </div>

            <div id='explain_touchnotouch' className='invisible'>
                <h3>{it.L('Contract period')}</h3>
                <p>{it.L('The <strong>contract period</strong> is the period between the <strong>next tick</strong> after the <strong>start time</strong> and the <strong>end time</strong>.')}</p>
                <p>{it.L('The <strong>start time</strong> is when the contract is processed by our servers.')}</p>
                <p>{it.L('The <strong>end time</strong> is the selected number of minutes/hours after the <strong>start time</strong> (if less than one day in duration), or at the end of the trading day (if one day or more in duration).')}</p>
                <p className='hint'><strong>{it.L('Note')}: </strong>{it.L('Touch/No Touch contracts will be refunded at the purchase price if there are less than 2 ticks between the start and end times.')}</p>
            </div>
            <div id='explain_lookbacklow' className='invisible'>
                <h3>{it.L('High, Low and Close')}</h3>
                <p>{it.L('The [_1]high[_2] is the highest point ever reached by the market during the contract period.', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]low[_2] is the lowest point ever reached by the market during the contract period.', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]close[_2] is the latest tick at or before the [_1]end time[_2]. If you selected a specific [_1]end time,[_2] the [_1]end time[_2] is the selected time.', '<strong>','</strong>')}</p>
                <h3>{it.L('Contract period')}</h3>
                <p>{it.L('The [_1]contract period[_2] is the period between the [_1]first tick[_2] (after start time) and the [_1]end time[_2].', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]start time[_2] begins when the contract is processed by our servers.', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]end time[_2] is the selected number of minutes/hours after the [_1]start time[_2].', '<strong>','</strong>')}</p>
            </div>
            <div id='explain_lookbackhigh' className='invisible'>
                <h3>{it.L('High, Low and Close')}</h3>
                <p>{it.L('The [_1]high[_2] is the highest point ever reached by the market during the contract period.', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]low[_2] is the lowest point ever reached by the market during the contract period.', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]close[_2] is the latest tick at or before the [_1]end time[_2]. If you selected a specific [_1]end time,[_2] the [_1]end time[_2] is the selected time.', '<strong>','</strong>')}</p>
                <h3>{it.L('Contract period')}</h3>
                <p>{it.L('The [_1]contract period[_2] is the period between the [_1]first tick[_2] (after start time) and the [_1]end time[_2].', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]start time[_2] begins when the contract is processed by our servers.', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]end time[_2] is the selected number of minutes/hours after the [_1]start time[_2].', '<strong>','</strong>')}</p>
            </div>
            <div id='explain_lookbackhighlow' className='invisible'>
                <h3>{it.L('High, Low and Close')}</h3>
                <p>{it.L('The [_1]high[_2] is the highest point ever reached by the market during the contract period.', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]low[_2] is the lowest point ever reached by the market during the contract period.', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]close[_2] is the latest tick at or before the [_1]end time[_2]. If you selected a specific [_1]end time,[_2] the [_1]end time[_2] is the selected time.', '<strong>','</strong>')}</p>
                <h3>{it.L('Contract period')}</h3>
                <p>{it.L('The [_1]contract period[_2] is the period between the [_1]first tick[_2] (after start time) and the [_1]end time[_2].', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]start time[_2] begins when the contract is processed by our servers.', '<strong>','</strong>')}</p>
                <p>{it.L('The [_1]end time[_2] is the selected number of minutes/hours after the [_1]start time[_2].', '<strong>','</strong>')}</p>
            </div>
        </div>
    </div>
);

export default Explanation;
