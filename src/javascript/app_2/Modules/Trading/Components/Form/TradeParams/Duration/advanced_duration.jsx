import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React, { Fragment }            from 'react';
import TimePicker                     from 'App/Components/Form/time_picker.jsx';
import DatePicker                     from 'App/Components/Form/DatePicker';
import Dropdown                       from 'App/Components/Form/DropDown';
import ButtonToggleMenu               from 'App/Components/Form/button_toggle_menu.jsx';
import InputField                     from 'App/Components/Form/input_field.jsx';
import RangeSlider                    from 'App/Components/Form/RangeSlider';
import { hasIntradayDurationUnit }    from 'Stores/Modules/Trading/Helpers/duration';
import {
    isTimeValid,
    minDate,
    setTime,
    toMoment }                        from 'Utils/Date';

const AdvancedDuration = ({
    advanced_duration_unit,
    advanced_expiry_type,
    duration_min_max,
    duration_units_list,
    changeDurationUnit,
    getDurationFromUnit,
    expiry_date,
    expiry_list,
    expiry_time,
    expiry_type,
    is_nativepicker,
    number_input_props,
    onChange,
    server_time,
    sessions,
    shared_input_props,
    start_date,
    start_time,
    market_close_times,
    onChangeUiStore,
    duration_t,
}) => {
    const moment_expiry      = toMoment(expiry_date || server_time);
    let is_24_hours_contract = false;
    let expiry_time_sessions = sessions;
    let max_date_duration,
        min_date_expiry;

    if (expiry_type === 'endtime') {
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

    const endtime_container_class = classNames('endtime-container', {
        'has-time': is_24_hours_contract,
    });

    const changeExpiry = ({ target }) => {
        const { name, value } = target;

        onChange({ target: { name: 'expiry_type', value } });
        onChangeUiStore({ name, value });
    };

    return (
        <Fragment>
            { expiry_list.length > 1 &&
                <ButtonToggleMenu
                    buttons_arr={expiry_list}
                    name='advanced_expiry_type'
                    onChange={changeExpiry}
                    value={advanced_expiry_type}
                />
            }
            { expiry_type === 'duration' ?
                <Fragment>
                    <div className='duration-container'>
                        { duration_units_list.length > 1 &&
                            <Dropdown
                                is_alignment_left
                                is_nativepicker={is_nativepicker}
                                list={duration_units_list}
                                name='advanced_duration_unit'
                                onChange={changeDurationUnit}
                                value={advanced_duration_unit}
                            />
                        }
                        { advanced_duration_unit === 't' &&
                            <RangeSlider
                                name='duration'
                                ticks={10}
                                value={duration_t}
                                {...shared_input_props}
                            />
                        }
                        { advanced_duration_unit === 'd' &&
                            <DatePicker
                                name='duration'
                                has_today_btn
                                min_date={min_date_expiry}
                                max_date={max_date_duration}
                                start_date={start_date}
                                onChange={onChange}
                                value={expiry_date}
                                is_clearable
                                mode='duration'
                                is_nativepicker={is_nativepicker}
                                alignment='left'
                                disabled_selector={['year']}
                            // sessions={expiry_date_sessions} TODO: add expiry date sessions. e.g. disable days if market closes on weekend
                            // validation_errors={validation_errors.expiry_date} TODO: add validation_errors for expiry date
                            />
                        }
                        { (advanced_duration_unit !== 't' && advanced_duration_unit !== 'd') &&
                            <InputField
                                label={duration_units_list.length === 1 ? duration_units_list[0].text : null}
                                name='duration'
                                value={getDurationFromUnit(advanced_duration_unit)}
                                {...number_input_props}
                                {...shared_input_props}
                            />
                        }
                    </div>
                </Fragment> :
                <Fragment>
                    <div className={endtime_container_class}>
                        <DatePicker
                            name='expiry_date'
                            has_today_btn
                            min_date={min_date_expiry}
                            max_date={max_date_duration}
                            start_date={start_date}
                            onChange={onChange}
                            value={expiry_date}
                            is_read_only
                            is_clearable
                            is_nativepicker={is_nativepicker}
                            alignment='left'
                            disabled_selector={['year']}
                            // sessions={expiry_date_sessions} TODO: add expiry date sessions. e.g. disable days if market closes on weekend
                            // validation_errors={validation_errors.expiry_date} TODO: add validation_errors for expiry date
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
                </Fragment>
            }
        </Fragment>
    );
};

AdvancedDuration.propTypes = {
    advanced_duration_unit: PropTypes.string,
    advanced_expiry_type  : PropTypes.string,
    changeDurationUnit    : PropTypes.func,
    duration_min_max      : PropTypes.object,
    duration_t            : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_date        : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    expiry_list        : PropTypes.array,
    expiry_time        : PropTypes.string,
    expiry_type        : PropTypes.string,
    getDurationFromUnit: PropTypes.func,
    is_nativepicker    : PropTypes.bool,
    market_close_times : PropTypes.array,
    number_input_props : PropTypes.object,
    onChange           : PropTypes.func,
    onChangeUiStore    : PropTypes.func,
    server_time        : PropTypes.object,
    sessions           : MobxPropTypes.arrayOrObservableArray,
    shared_input_props : PropTypes.object,
    start_date         : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    start_time: PropTypes.string,
};

export default AdvancedDuration;
