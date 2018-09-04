const CommonFunctions = require('../../../_common/common_functions');
const localize        = require('../../../_common/localize').localize;

/*
 * Handle Reset option
 */
const Reset = (() => {
    /*
     * Displays reset time
     */
    const displayResetTime = (duration_value, duration_unit) => {
        let reset_time_str = '';
        let val;

        const mid_point = duration_value / 2; // a Reset happens at midpoint

        const duration_map = {
            s: 'seconds',
            m: 'minutes',
            h: 'hour', // currently the max possible Reset time for h is 1hr
            t: 'ticks',
        };

        if (mid_point % 1 !== 0 && /[mh]/.test(duration_unit)) {
            val = Math.floor(mid_point);
            switch (duration_unit) {
                case 'm':
                    reset_time_str = `${val ? `${val} ${localize('minutes')}` : ''} 30 ${localize('seconds')}`;
                    break;
                case 'h':
                    reset_time_str = `${val || ''} 30 ${localize('minutes')}`;
                    break;
                default: // no default
            }
        } else {
            val = (duration_unit === 't') ? Math.floor(mid_point) : Math.ceil(mid_point);
            reset_time_str = `${val} ${localize(duration_map[duration_unit])}`;
        }

        CommonFunctions.getElementById('reset_time')
            .html(localize('The reset time is [_1]', [reset_time_str]))
            .setAttribute('style', '');
    };

    const hideResetTime = () => { CommonFunctions.getElementById('reset_time').style.display = 'none'; };

    const isNewBarrier = (entry_barrier, current_barrier) => (+entry_barrier !== +current_barrier);

    const isReset = (contract_type) => /reset/i.test(contract_type);

    return {
        displayResetTime,
        hideResetTime,
        isNewBarrier,
        isReset,
    };
})();

module.exports = Reset;
