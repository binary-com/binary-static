import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';
import {
    // isTimeValid,
    // minDate,
    setTime,
    toMoment }     from 'Utils/Date';
import TimePicker  from 'App/Components/Form/TimePicker';
import {
    getSelectedTime,
    getBoundaries } from 'Stores/Modules/Trading/Helpers/end-time';

const TradingTimePicker = ({
    expiry_date,
    expiry_time,
    market_close_times,
    market_open_times,
    onChange,
    server_time,
    // start_date,
    // start_time,
}) => {
    /*
    const contract_start = setTime(
        toMoment(start_date || server_dt.clone()),
        isTimeValid(start_time)
            ? start_time
            : server_dt.clone().format('HH:mm'));

    const contract_expiry = setTime(
        expiry_dt.clone(),
        contract_start.clone().add(5, 'minute').format('HH:mm'));

    const market_next_day_close = setTime(
        expiry_dt.clone(),
        market_close_times.slice(-1)[0]);
    
    // Boundaries for TimePicker.
    const is_expired_next_day = contract_expiry.diff(contract_start, 'day') === 1;
    const expiry_time_start = is_expired_next_day
        ? contract_expiry.clone().startOf('day')
        : contract_expiry.clone();
    const expiry_time_end   = is_expired_next_day
        ? minDate(
            contract_expiry.clone().subtract(10, 'minute'),
            market_next_day_close)
        : market_next_day_close.clone();
    */
    const expiry_datetime = setTime(toMoment(expiry_date), expiry_time);
    const server_datetime = toMoment(server_time);
    const market_open_datetime  = setTime(toMoment(expiry_date), market_open_times[0]);
    const market_close_datetime = setTime(toMoment(expiry_date), market_close_times.slice(-1)[0]);
    const boundaries = getBoundaries(
        server_datetime,
        market_open_datetime,
        market_close_datetime);

    // Calculate valid value to be highlighted.
    const selected_time = getSelectedTime(server_datetime, expiry_datetime, market_open_datetime);
    return (
        <TimePicker
            end_time={boundaries.max}
            onChange={onChange}
            name='expiry_time'
            placeholder='12:00'
            start_time={boundaries.min}
            value={selected_time}
        />
    );
};

TradingTimePicker.propTypes = {
    expiry_date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    expiry_time       : PropTypes.string,
    market_close_times: PropTypes.array,
    name              : PropTypes.string,
    onChange          : PropTypes.func,
    server_time       : PropTypes.object,
    start_date        : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    start_time: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.object,
    ]),
};

export default connect(
    ({ modules, common }) => ({
        duration_units_list: modules.trade.duration_units_list,
        expiry_time        : modules.trade.expiry_time,
        expiry_date        : modules.trade.expiry_date,
        market_close_times : modules.trade.market_close_times,
        market_open_times  : modules.trade.market_open_times,
        onChange           : modules.trade.onChange,
        server_time        : common.server_time,
        start_date         : modules.trade.start_date,
        start_time         : modules.trade.start_time,
    })
)(TradingTimePicker);
