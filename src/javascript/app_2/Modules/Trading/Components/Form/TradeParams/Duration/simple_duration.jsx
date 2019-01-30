import { PropTypes as MobxPropTypes }   from 'mobx-react';
import PropTypes                        from 'prop-types';
import React, { Fragment }              from 'react';
import ButtonToggleMenu                 from 'App/Components/Form/button_toggle_menu.jsx';
import InputField                       from 'App/Components/Form/input_field.jsx';
import RangeSlider                      from 'App/Components/Form/RangeSlider';

const SimpleDuration = ({
    changeDurationUnit,
    getDurationValue,
    number_input_props,
    duration_units_list,
    shared_input_props,
    simple_duration_unit,
    duration_t,
}) => {
    const filterMinutesAndTicks = (arr) => {
        const filtered_arr = arr.filter(du => du.value === 't' || du.value === 'm');
        if (filtered_arr.length <= 1) return [];

        return filtered_arr;
    };
    const has_label = !duration_units_list.some(du => du.value === 't');

    return (
        <Fragment>
            <ButtonToggleMenu
                buttons_arr={filterMinutesAndTicks(duration_units_list)}
                name='simple_duration_unit'
                onChange={changeDurationUnit}
                value={simple_duration_unit}
            />
            { simple_duration_unit === 't' &&
                <RangeSlider
                    name='duration'
                    value={duration_t}
                    ticks={10}
                    {...shared_input_props}
                />
            }
            { simple_duration_unit !== 't' &&
                <InputField
                    name='duration'
                    label={has_label ? duration_units_list[0].text : null}
                    value={getDurationValue(simple_duration_unit)}
                    {...number_input_props}
                    {...shared_input_props}
                />
            }
        </Fragment>
    );
};

SimpleDuration.propTypes = {
    changeDurationUnit  : PropTypes.func,
    duration_t          : PropTypes.number,
    duration_units_list : MobxPropTypes.arrayOrObservableArray,
    getDurationValue    : PropTypes.func,
    number_input_props  : PropTypes.object,
    shared_input_props  : PropTypes.object,
    simple_duration_unit: PropTypes.string,
};

export default SimpleDuration;
