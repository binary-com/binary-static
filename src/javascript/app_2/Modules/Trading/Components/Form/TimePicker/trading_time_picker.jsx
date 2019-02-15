import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';
import {
    isTimeValid,
    minDate,
    setTime,
    toMoment }     from 'Utils/Date';
import TimePicker  from 'App/Components/Form/TimePicker';

const TradingTimePicker = ({
    server_time,
    expiry_date,
    expiry_time,
    start_time,
    start_date,
    onChange,
    market_close_times,
}) => {
    const moment_expiry = toMoment(expiry_date || server_time);
    const moment_contract_start_date_time =
        setTime(toMoment(start_date || server_time), (isTimeValid(start_time) ? start_time : server_time.format('HH:mm')));
    const expiry_date_time = setTime(moment_expiry.clone(), moment_contract_start_date_time.clone().add(5, 'minute').format('HH:mm'));
    const expiry_date_market_close = setTime(expiry_date_time.clone(), market_close_times.slice(-1)[0]);
    const is_expired_next_day = expiry_date_time.diff(moment_contract_start_date_time, 'day') === 1;
    const min_date_expiry = moment_contract_start_date_time.clone().startOf('day');
    const expiry_time_sessions = [{
        open : is_expired_next_day ? expiry_date_time.clone().startOf('day') : expiry_date_time.clone(),
        close: is_expired_next_day ? minDate(expiry_date_time.clone().subtract(10, 'minute'), expiry_date_market_close) : expiry_date_market_close.clone(),
    }];

    return (
        <TimePicker
            end_time={expiry_time_sessions[0].close}
            onChange={onChange}
            name='expiry_time'
            placeholder='12:00'
            start_time={expiry_time_sessions[0].open}
            value={expiry_time || min_date_expiry.format('HH:mm')}
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
    start_time: PropTypes.string,
    
};

export default connect(
    ({ modules, common }) => ({
        expiry_date        : modules.trade.expiry_date,
        duration_units_list: modules.trade.duration_units_list,
        start_time         : modules.trade.start_time,
        start_date         : modules.trade.start_date,
        expiry_time        : modules.trade.expiry_time,
        onChange           : modules.trade.onChange,
        server_time        : common.server_time,
        market_close_times : modules.trade.market_close_times,
    })
)(TradingTimePicker);
