import { PropTypes as MobxPropTypes }   from 'mobx-react';
import PropTypes                        from 'prop-types';
import React, { Fragment }              from 'react';
import ButtonToggleMenu                 from 'App/Components/Form/button_toggle_menu.jsx';
import InputField                       from 'App/Components/Form/input_field.jsx';
import RangeSlider                      from 'App/Components/Form/RangeSlider';

const SimpleDuration = ({
    number_input_props,
    duration_units_list,
    onChange,
    shared_input_props,
    sim_duration_unit,
    onChangeDurationU,
    duration_t,
    duration_m,
    duration_d,
    duration_unit,
}) => {
    const filterMinutesAndTicks = (arr) => {
        const filtered_arr = arr.filter(du => du.value === 't' || du.value === 'm');
        if (filtered_arr.length <= 1) return [];

        return filtered_arr;
    };
    const has_label = !duration_units_list.some(du => du.value === 't');

    const get_duration_value = du => {
        const duration_obj = {
            t: duration_t,
            m: duration_m,
            d: duration_d,
        };
        return duration_obj[du];
    };

    const changeDurationUnit = ({ target }) => {
        const { name, value } = target;
        const duration_value  = get_duration_value(value);
        
        onChangeDurationU({ name, value });
        onChange({ target: { name: 'duration_unit', value } });
        onChange({ target: { name: 'duration', value: duration_value } });
    };

    const changeDurationValue = ({ target }) => {
        const { name, value } = target;
        const duration_name   = `duration_${sim_duration_unit}`;

        onChangeDurationU({ name: duration_name, value });
        onChange({ target: { name, value } });
    };
    
    return (
        <Fragment>
            <ButtonToggleMenu
                buttons_arr={filterMinutesAndTicks(duration_units_list)}
                name='sim_duration_unit'
                onChange={changeDurationUnit}
                value={sim_duration_unit}
            />
            { sim_duration_unit === 't' &&
                <RangeSlider
                    name='duration'
                    value={duration_t}
                    ticks={10}
                    {...shared_input_props}
                    onChange={changeDurationValue}
                />
            }
            { sim_duration_unit === 'm' &&
                <InputField
                    name='duration'
                    label={has_label ? duration_units_list[0].text : null}
                    value={duration_m}
                    {...number_input_props}
                    {...shared_input_props}
                    onChange={changeDurationValue}
                />
            }
            { sim_duration_unit === 'd' &&
                <InputField
                    name='duration'
                    label={duration_units_list[0].text}
                    value={duration_d}
                    {...number_input_props}
                    {...shared_input_props}
                    onChange={changeDurationValue}
                />
            }
        </Fragment>
    );
};

SimpleDuration.propTypes = {
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_type        : PropTypes.string,
    number_input_props : PropTypes.object,
    onChange           : PropTypes.func,
    shared_input_props : PropTypes.object,
    sim_duration_unit  : PropTypes.string,
    simple_duration    : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    simple_duration_unit: PropTypes.string,
};

export default SimpleDuration;
