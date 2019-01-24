import classNames               from 'classnames';
import {
    PropTypes as MobxPropTypes,
    observer }                  from 'mobx-react';
import PropTypes                from 'prop-types';
import React                    from 'react';
import { localize }             from '_common/localize';
import Datepicker               from 'App/Components/Form/DatePicker';
import Dropdown                 from 'App/Components/Form/DropDown';
import Fieldset                 from 'App/Components/Form/fieldset.jsx';
import InputField               from 'App/Components/Form/input_field.jsx';
import RangeSlider              from 'App/Components/Form/RangeSlider';
import TimePicker               from 'App/Components/Form/time_picker.jsx';
import {
    convertDurationLimit,
    hasIntradayDurationUnit }   from 'Stores/Modules/Trading/Helpers/duration';
import {
    isTimeValid,
    minDate,
    setTime,
    toMoment }                  from 'Utils/Date';

/* TODO:
      1. disable days other than today and tomorrow if start date is forward starting
*/

const Duration = ({
    contract_expiry_type,
    duration,
    duration_unit,
    duration_units_list,
    duration_min_max,
    expiry_date,
    expiry_time,
    expiry_type,
    onChange,
    is_minimized,
    is_nativepicker,
    server_time,
    sessions,
    start_date,
    start_time,
    market_close_times,
    validation_errors,
}) => {
    const expiry_list = [
        { text: localize('Duration'), value: 'duration' },
    ];

    const moment_expiry      = toMoment(expiry_date || server_time);
    let is_24_hours_contract = false;
    let expiry_time_sessions = sessions;
    let max_date_duration,
        min_date_expiry,
        max_duration,
        min_duration;

    if (expiry_type !== 'endtime' && duration_min_max[contract_expiry_type]) {
        min_duration = convertDurationLimit(+duration_min_max[contract_expiry_type].min, duration_unit);
        max_duration = convertDurationLimit(+duration_min_max[contract_expiry_type].max, duration_unit);

    } else if (expiry_type === 'endtime') {
        const max_daily_duration = duration_min_max.daily ? duration_min_max.daily.max : 365 * 24 * 3600;
        const moment_contract_start_date_time =
            setTime(toMoment(start_date || server_time), (isTimeValid(start_time) ? start_time : server_time.format('HH:mm')));
        const has_intraday_duration_unit = hasIntradayDurationUnit(duration_units_list);

        // When the contract start is forwarding or is not forwarding but the expiry date is as same as start date, the contract should be expired within 24 hours
        is_24_hours_contract = (!!start_date || moment_expiry.isSame(toMoment(server_time), 'day')) && has_intraday_duration_unit;

        if (is_24_hours_contract) {
            const expiry_date_time         = setTime(moment_expiry.clone(), moment_contract_start_date_time.clone().add(5, 'minute').format('HH:mm'));
            const expiry_date_market_close = setTime(expiry_date_time.clone(), market_close_times.slice(-1)[0]);
            const is_expired_next_day      = expiry_date_time.diff(moment_contract_start_date_time, 'day') === 1;

            expiry_time_sessions = [{
                open : is_expired_next_day ? expiry_date_time.clone().startOf('day') : expiry_date_time.clone(),
                // when the expiry_date is on the next day of the start_date, the session should be close 5 min before the start_time of the contract.
                close: is_expired_next_day ? minDate(expiry_date_time.clone().subtract(10, 'minute'), expiry_date_market_close) : expiry_date_market_close.clone(),
            }];

            min_date_expiry = moment_contract_start_date_time.clone().startOf('day');
            max_date_duration = moment_contract_start_date_time.clone().add(
                start_date ? 24 * 3600 : (max_daily_duration), 'second');
        } else {
            min_date_expiry = moment_contract_start_date_time.clone().startOf('day');
            max_date_duration = moment_contract_start_date_time.clone().add(max_daily_duration, 'second');

            if (!has_intraday_duration_unit) {
                min_date_expiry.add(1, 'day');
            }
        }
    }
    if (is_minimized) {
        const duration_unit_text = (duration_units_list.find(o => o.value === duration_unit) || {}).text;
        return (
            <div className='fieldset-minimized duration'>
                <span className='icon trade-duration' />
                {expiry_type === 'duration'
                    ? `${duration} ${duration_unit_text}`
                    : `${moment_expiry.format('ddd - DD MMM, YYYY')}\n${expiry_time}`
                }
            </div>
        );
    }

    const has_end_time = expiry_list.find(expiry => expiry.value === 'endtime');
    if (duration_units_list.length === 1 && duration_unit === 't') {
        if (has_end_time) {
            expiry_list.pop(); // remove end time for contracts with only tick duration
        }
    } else if (!has_end_time) {
        expiry_list.push({ text: localize('End Time'), value: 'endtime' });
    }

    const endtime_container_class = classNames('endtime-container', {
        'has-time': is_24_hours_contract,
    });

    return (
        <Fieldset
            header={localize('Trade Duration')}
            icon='trade-duration'
        >
            <Dropdown
                list={expiry_list}
                value={expiry_type}
                name='expiry_type'
                onChange={onChange}
                is_nativepicker={is_nativepicker}
            />

            {expiry_type === 'duration' ?
                <React.Fragment>
                    <div className='duration-container'>
                        <Dropdown
                            list={duration_units_list}
                            value={duration_unit}
                            name='duration_unit'
                            onChange={onChange}
                            is_nativepicker={is_nativepicker}
                        />
                        {
                            duration_unit === 't' ?
                                <RangeSlider
                                    max_value={max_duration}
                                    min_value={min_duration}
                                    name='duration'
                                    ticks={10}
                                    value={duration}
                                    onChange={onChange}
                                />
                                :
                                <InputField
                                    type='number'
                                    max_value={max_duration}
                                    min_value={min_duration}
                                    name='duration'
                                    value={duration}
                                    onChange={onChange}
                                    is_nativepicker={is_nativepicker}
                                    is_incrementable={true}
                                    error_messages = {validation_errors.duration || []}
                                />
                        }
                    </div>
                </React.Fragment> :
                <React.Fragment>
                    <div className={endtime_container_class}>
                        <Datepicker
                            name='expiry_date'
                            has_today_btn
                            min_date={min_date_expiry}
                            max_date={max_date_duration}
                            start_date={start_date}
                            onChange={onChange}
                            value={expiry_date}
                            is_read_only
                            is_clearable={false}
                            is_nativepicker={is_nativepicker}
                        />
                        {is_24_hours_contract &&
                            <TimePicker
                                onChange={onChange}
                                is_align_right
                                name='expiry_time'
                                placeholder='12:00'
                                sessions={expiry_time_sessions}
                                start_date={moment_expiry.unix()}
                                value={expiry_time || min_date_expiry.format('HH:mm')}
                                is_clearable={false}
                                is_nativepicker={is_nativepicker}
                                // validation_errors={validation_errors.end_time} TODO: add validation_errors for end time
                            />
                        }
                    </div>
                </React.Fragment>
            }
        </Fieldset>
    );
};

// ToDo: Refactor Duration.jsx and date_picker.jsx
Duration.propTypes = {
    contract_expiry_type: PropTypes.string,
    duration            : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_min_max   : PropTypes.object,
    duration_unit      : PropTypes.string,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_date        : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    expiry_time       : PropTypes.string,
    expiry_type       : PropTypes.string,
    is_minimized      : PropTypes.bool,
    is_nativepicker   : PropTypes.bool,
    market_close_times: PropTypes.array,
    onChange          : PropTypes.func,
    server_time       : PropTypes.object,
    sessions          : MobxPropTypes.arrayOrObservableArray,
    start_date        : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    start_time       : PropTypes.string,
    validation_errors: PropTypes.object,
};

export default observer(Duration);
