import classNames                       from 'classnames';
import { PropTypes as MobxPropTypes }   from 'mobx-react';
import PropTypes                        from 'prop-types';
import React, { Fragment }              from 'react';
import TimePicker                       from 'App/Components/Form/time_picker.jsx';
import Datepicker                       from 'App/Components/Form/DatePicker';
import Dropdown                         from 'App/Components/Form/DropDown';
import ButtonToggleMenu                 from 'App/Components/Form/button_toggle_menu.jsx';
import InputField                       from 'App/Components/Form/input_field.jsx';
import RangeSlider                      from 'App/Components/Form/RangeSlider';
import { convertDurationUnit }          from 'Stores/Modules/Trading/Helpers/duration';
import {
    isTimeValid,
    toMoment }                          from 'Utils/Date';

let now_date,
    max_date_duration,
    min_date_expiry,
    min_day,
    max_day,
    start_date_time;

const AdvancedDuration = ({
    contract_expiry_type,
    duration_min_max,
    duration_unit,
    duration_units_list,
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
}) => {
    if (duration_min_max[contract_expiry_type]) {
        const moment_now  = toMoment(server_time);
        const new_min_day = convertDurationUnit(duration_min_max[contract_expiry_type].min, 's', 'd');
        const new_max_day = convertDurationUnit(duration_min_max[contract_expiry_type].max, 's', 'd');
        if (!now_date || moment_now.date() !== now_date.date() || (duration_unit === 'd' && (min_day !== new_min_day || max_day !== new_max_day))) {
            if (duration_unit === 'd') {
                min_day = new_min_day;
                max_day = new_max_day;
            }
            const moment_today = moment_now.clone().startOf('day');

            now_date          = moment_now.clone();
            max_date_duration = moment_today.clone().add(max_day || 365, 'd');
            min_date_expiry   = moment_today.clone();
        }
    }

    const moment_expiry = toMoment(expiry_date);
    const is_same_day   = moment_expiry.isSame(toMoment(start_date), 'day');
    if (is_same_day) {
        const date_time = toMoment(start_date);
        if (start_date && isTimeValid(start_time)) {
            const [ hour, minute ] = start_time.split(':');
            date_time.hour(hour).minute(minute).second(0).add(5, 'minutes');
        }
        // only update start time every five minutes, since time picker shows five minute durations
        const moment_start_date_time = toMoment(start_date_time);
        if (!start_date_time || moment_start_date_time.isAfter(date_time) || moment_start_date_time.clone().add(5, 'minutes').isBefore(date_time) ||
            (moment_start_date_time.minutes() !== date_time.minutes() && date_time.minutes() % 5 === 0)) {
            start_date_time = date_time.unix();
        }
    }
    const endtime_container_class = classNames('endtime-container', {
        'has-time': is_same_day,
    });
    return (
        <Fragment>
            <ButtonToggleMenu
                name='expiry_type'
                value={expiry_type}
                onChange={onChange}
                buttons_arr={expiry_list.length > 1 && expiry_list}
            />
            {expiry_type === 'duration' ?
                <Fragment>
                    <div className='duration-container'>
                        {duration_units_list.length > 1 &&
                            <Dropdown
                                list={duration_units_list}
                                value={duration_unit}
                                name='duration_unit'
                                onChange={onChange}
                                is_nativepicker={is_nativepicker}
                            />
                        }
                        { duration_unit === 't' && <RangeSlider ticks={10} {...shared_input_props} /> }
                        { duration_unit !== 't' && <InputField {...number_input_props} {...shared_input_props} />}
                    </div>
                </Fragment> :
                <Fragment>
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
                        {is_same_day &&
                            <TimePicker
                                onChange={onChange}
                                is_align_right
                                name='expiry_time'
                                value={expiry_time}
                                placeholder='12:00'
                                start_date={start_date_time}
                                sessions={sessions}
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
    contract_expiry_type: PropTypes.string,
    duration_min_max    : PropTypes.object,
    duration_unit       : PropTypes.string,
    duration_units_list : MobxPropTypes.arrayOrObservableArray,
    expiry_date         : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    expiry_list       : PropTypes.array,
    expiry_time       : PropTypes.string,
    expiry_type       : PropTypes.string,
    is_nativepicker   : PropTypes.bool,
    number_input_props: PropTypes.object,
    onChange          : PropTypes.func,
    server_time       : PropTypes.object,
    sessions          : MobxPropTypes.arrayOrObservableArray,
    shared_input_props: PropTypes.object,
    start_date        : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    start_time: PropTypes.string,
};

export default AdvancedDuration;
