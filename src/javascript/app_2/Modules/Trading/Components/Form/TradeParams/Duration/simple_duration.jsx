import { PropTypes as MobxPropTypes }   from 'mobx-react';
import PropTypes                        from 'prop-types';
import React, { Fragment }              from 'react';
import ButtonToggleMenu                 from 'App/Components/Form/button_toggle_menu.jsx';
import InputField                       from 'App/Components/Form/input_field.jsx';
import RangeSlider                      from 'App/Components/Form/RangeSlider';

const SimpleDuration = ({
    number_input_props,
    duration_unit,
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

    if (expiry_type !== 'duration') {
        onChange({ target: { value: 'duration', name: 'expiry_type' } });
    }
    if (duration_units_list.length > 1 && duration_unit !== 't' && duration_unit !== 'm') {
        onChange({ target: { value: 't', name: 'duration_unit' } });
    }
    return (
        <Fragment>
            <ButtonToggleMenu
                value={duration_unit}
                name='duration_unit'
                onChange={onChange}
                buttons_arr={filterMinutesAndTicks(duration_units_list)}
            />
            { duration_unit === 't' && <RangeSlider ticks={10} {...shared_input_props} /> }
            { duration_unit !== 't' && <InputField {...number_input_props} {...shared_input_props} /> }
        </Fragment>
    );
};

SimpleDuration.propTypes = {
    duration_unit      : PropTypes.string,
    duration_units_list: MobxPropTypes.arrayOrObservableArray,
    expiry_type        : PropTypes.string,
    number_input_props : PropTypes.object,
    onChange           : PropTypes.func,
    shared_input_props : PropTypes.object,
};

export default SimpleDuration;
