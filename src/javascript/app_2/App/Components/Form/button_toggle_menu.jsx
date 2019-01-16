import PropTypes from 'prop-types';
import React     from 'react';
import Button    from './button.jsx';

const ButtonToggleMenu = ({
    buttons_for,
    onChange,
    value,
    name,
}) => {
    const changeValue = (duration_value) => {
        console.log(value, duration_value, name);
        if (value === duration_value) return;
        onChange({ target: { value: duration_value, name } });
    };
    const menu = buttons_for.map((val, idx) => (
        <Button
            key={idx} 
            text={val.text}
            onClick={() => changeValue(val.value)}
            className='button-menu-wrapper__button' />)
    );
    return <div className='button-menu-wrapper'>{menu}</div>;
};

ButtonToggleMenu.propTypes = {
    buttons_for: PropTypes.array,
    onChange   : PropTypes.func,
};

export default ButtonToggleMenu;