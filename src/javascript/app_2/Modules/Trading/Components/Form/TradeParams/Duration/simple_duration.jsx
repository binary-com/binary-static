import React, { Fragment }      from 'react';
import ButtonToggleMenu         from 'App/Components/Form/button_toggle_menu.jsx';
import InputField               from 'App/Components/Form/input_field.jsx';

const SimpleDuration = ({
    duration_input_props,
    duration_unit,
    onChange,
    duration_units_list,
}) => {
    const filterMenu = (arr) => {
        if (arr.length === 1) return [];
        return arr.filter(du => du.value === 't' || du.value === 'm');
    };
    if (duration_units_list.length > 1 && duration_unit !== 't' && duration_unit !== 'm') {
        onChange({ target: { value: 't', name: 'duration_unit' } });
    }
    return (
        <Fragment>
            <ButtonToggleMenu
                value={duration_unit}
                name='duration_unit'
                onChange={onChange}
                buttons_arr={filterMenu(duration_units_list)}
            />
            {duration_unit === 't' &&
                <span>Range slider</span>
            }
            {duration_unit !== 't' &&
                <InputField
                    {...duration_input_props}
                />
            }
        </Fragment>
    );
};

export default SimpleDuration;
