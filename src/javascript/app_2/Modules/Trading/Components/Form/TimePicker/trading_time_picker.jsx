import PropTypes                      from 'prop-types';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import React                          from 'react';
import { connect }                    from 'Stores/connect';
import { hasIntradayDurationUnit }    from 'Stores/Modules/Trading/Helpers/duration';
import {
    isTimeValid,
    minDate,
    setTime,
    toMoment }                        from 'Utils/Date';
import TimePicker                     from 'App/Components/Form/time_picker.jsx';

const TradingTimePicker = ({
    is_nativepicker,
    name,
    server_time,
    expiry_date,
    expiry_time,
    duration_units_list,
    start_time,
    start_date,
    expiry_type,
    onChange,
    sessions,
    market_close_times,
}) => {
    const moment_expiry      = toMoment(expiry_date || server_time);
    let is_24_hours_contract = false;
    let expiry_time_sessions = sessions;
    let min_date_expiry;

    if (expiry_type === 'endtime') {
        const moment_contract_start_date_time =
            setTime(toMoment(start_date || server_time), (isTimeValid(start_time) ? start_time : server_time.format('HH:mm')));
        const has_intraday_duration_unit = hasIntradayDurationUnit(duration_units_list);

        is_24_hours_contract = (!!start_date || moment_expiry.isSame(toMoment(server_time), 'day')) && has_intraday_duration_unit;

        if (is_24_hours_contract) {
            const expiry_date_time = setTime(moment_expiry.clone(), moment_contract_start_date_time.clone().add(5, 'minute').format('HH:mm'));
            const expiry_date_market_close = setTime(expiry_date_time.clone(), market_close_times.slice(-1)[0]);
            const is_expired_next_day = expiry_date_time.diff(moment_contract_start_date_time, 'day') === 1;

            min_date_expiry = moment_contract_start_date_time.clone().startOf('day');
            expiry_time_sessions = [{
                open : is_expired_next_day ? expiry_date_time.clone().startOf('day') : expiry_date_time.clone(),
                // when the expiry_date is on the next day of the start_date, the session should be close 5 min before the start_time of the contract.
                close: is_expired_next_day ? minDate(expiry_date_time.clone().subtract(10, 'minute'), expiry_date_market_close) : expiry_date_market_close.clone(),
            }];
        }
    }

    return (
        <TimePicker
            onChange={onChange}
            is_align_right
            sessions={expiry_time_sessions}
            start_date={moment_expiry.unix()}
            value={expiry_time || min_date_expiry.format('HH:mm')}
            is_clearable={false}
            is_nativepicker={is_nativepicker}
            name={name}
        />
    );
};

TradingTimePicker.propTypes = {
    is_nativepicker: PropTypes.bool,
    mode           : PropTypes.string,
    name           : PropTypes.string,
    server_time    : PropTypes.object,
    sessions       : MobxPropTypes.arrayOrObservableArray,
};

export default connect(
    ({ modules, common }) => ({
        expiry_date        : modules.trade.expiry_date,
        duration_units_list: modules.trade.duration_units_list,
        start_time         : modules.trade.start_time,
        start_date         : modules.trade.start_date,
        expiry_type        : modules.trade.expiry_type,
        expiry_time        : modules.trade.expiry_time,
        onChange           : modules.trade.onChange,
        server_time        : common.server_time,
        market_close_times : modules.trade.market_close_times,
        sessions           : modules.trade.sessions,
    })
)(TradingTimePicker);
