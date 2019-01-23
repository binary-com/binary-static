import { PropTypes as MobxPropTypes }   from 'mobx-react';
import PropTypes                        from 'prop-types';
import React, { Fragment }              from 'react';
import ButtonToggleMenu                 from 'App/Components/Form/button_toggle_menu.jsx';
import InputField                       from 'App/Components/Form/input_field.jsx';
import RangeSlider                      from 'App/Components/Form/RangeSlider';

const SimpleDuration = ({
    number_input_props,
    simple_duration_unit,
    simple_duration,
    duration_units_list,
    expiry_type,
    onChange,
    shared_input_props,
}) => {
    const filterMinutesAndTicks = (arr) => {
        const filtered_arr = arr.filter(du => du.value === 't' || du.value === 'm');
        if (filtered_arr.length <= 1) return [];

        return filtered_arr;
    };

    return (
        <Fragment>
            <ButtonToggleMenu
                value={simple_duration_unit}
                name='simple_duration_unit'
                onChange={onChange}
                buttons_arr={filterMinutesAndTicks(duration_units_list)}
            />
            { simple_duration_unit === 't' &&
                <RangeSlider
                    name='simple_duration'
                    value={simple_duration}
                    ticks={10}
                    {...shared_input_props}
                />
            }
            { simple_duration_unit !== 't' &&
                <InputField
                    name='simple_duration'
                    value={simple_duration}
                    {...number_input_props}
                    {...shared_input_props}
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
    simple_duration     : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    simple_duration_unit: PropTypes.string,
};

export default SimpleDuration;
