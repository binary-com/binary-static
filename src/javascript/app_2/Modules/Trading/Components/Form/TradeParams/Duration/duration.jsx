import {
    PropTypes as MobxPropTypes,
    observer }                  from 'mobx-react';
import PropTypes                from 'prop-types';
import React, { Fragment }      from 'react';
import { localize }             from '_common/localize';
import Fieldset                 from 'App/Components/Form/fieldset.jsx';
import RangeSlider              from 'App/Components/Form/RangeSlider';
import { convertDurationLimit } from 'Stores/Modules/Trading/Helpers/duration';
import { toMoment }             from 'Utils/Date';
import DurationToggle           from './duration_toggle.jsx';
import AdvancedDuration         from './advanced_duration.jsx';
import SimpleDuration           from './simple_duration.jsx';

const expiry_list = [
    { text: localize('Duration'), value: 'duration' },
];

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
    is_advanced_duration,
    is_minimized,
    is_nativepicker,
    server_time,
    sessions,
    start_date,
    start_time,
    validation_errors,
}) => {
    const has_end_time = expiry_list.find(expiry => expiry.value === 'endtime');
    if (duration_units_list.length === 1 && duration_unit === 't') {
        if (has_end_time) {
            expiry_list.pop(); // remove end time for contracts with only tick duration
        }
    } else if (!has_end_time) {
        expiry_list.push({ text: localize('End Time'), value: 'endtime' });
    }

    // TODO: Move to MobileComponent
    if (is_minimized) {
        const moment_expiry = toMoment(expiry_date);
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

    const props = {
        shared_input: {
            max_value: convertDurationLimit(+duration_min_max[contract_expiry_type].max, duration_unit),
            min_value: convertDurationLimit(+duration_min_max[contract_expiry_type].min, duration_unit),
            onChange,
            value    : duration,
            name     : 'duration',
        },
        number_input: {
            type            : 'number',
            is_nativepicker,
            is_incrementable: true,
            error_messages  : validation_errors.duration || [],
        },
    };
    // e.g. digit contracts only has range slider - does not have toggle between advanced / simple
    const has_toggle = expiry_list.length > 1 || duration_units_list.length > 1;
    return (
        <Fieldset className={'position-relative'}>
            { !has_toggle && <RangeSlider {...props.shared_input} ticks={10} /> }
            { has_toggle &&
                <Fragment>
                    { is_advanced_duration &&
                        <AdvancedDuration
                            contract_expiry_type={contract_expiry_type}
                            duration_min_max={duration_min_max}
                            duration_unit={duration_unit}
                            duration_units_list={duration_units_list}
                            expiry_date={expiry_date}
                            expiry_list={expiry_list}
                            expiry_time={expiry_time}
                            expiry_type={expiry_type}
                            is_nativepicker={is_nativepicker}
                            number_input_props={props.number_input}
                            onChange={onChange}
                            server_time={server_time}
                            sessions={sessions}
                            shared_input_props={props.shared_input}
                            start_date={start_date}
                            start_time={start_time}
                        /> }
                    { !is_advanced_duration &&
                        <SimpleDuration
                            duration_unit={duration_unit}
                            duration_units_list={duration_units_list}
                            number_input_props={props.number_input}
                            shared_input_props={props.shared_input}
                            expiry_type={expiry_type}
                            onChange={onChange}
                        /> }
                    <DurationToggle
                        name={'is_advanced_duration'}
                        onChange={onChange}
                        value={is_advanced_duration}
                    />
                </Fragment>
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
    expiry_time         : PropTypes.string,
    expiry_type         : PropTypes.string,
    is_advanced_duration: PropTypes.bool,
    is_minimized        : PropTypes.bool,
    is_nativepicker     : PropTypes.bool,
    onChange            : PropTypes.func,
    server_time         : PropTypes.object,
    sessions            : MobxPropTypes.arrayOrObservableArray,
    start_date          : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    start_time       : PropTypes.string,
    validation_errors: PropTypes.object,
};

export default observer(Duration);
