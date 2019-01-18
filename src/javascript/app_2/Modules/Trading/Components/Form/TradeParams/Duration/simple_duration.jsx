import React, { Fragment }      from 'react';
import ButtonToggleMenu         from 'App/Components/Form/button_toggle_menu.jsx';
import InputField               from 'App/Components/Form/input_field.jsx';

const SimpleDuration = ({
    duration_input_props,
    duration_unit,
    expiry_type,
    onChange,
    duration_units_list,
}) => {
    const minutesAndTicks = du => du.value === 't' || du.value === 'm';

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
                buttons_arr={duration_units_list.length > 1 && duration_units_list.filter(minutesAndTicks)}
            />
            {duration_unit === 't' &&
                <span>Range slider</span>
            }
            {duration_unit !== 't' &&
                <InputField {...duration_input_props} />
            }
        </Fragment>
    );
};

export default SimpleDuration;
