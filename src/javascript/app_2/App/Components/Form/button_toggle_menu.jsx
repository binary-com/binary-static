import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Button     from './button.jsx';

const ButtonToggleMenu = ({
    buttons_arr,
    onChange,
    value,
    name,
}) => {
    const changeValue = (selected_value) => {
        if (value === selected_value) return;
        onChange({ target: { value: selected_value, name } });
    };
    const menu = buttons_arr.map((val, idx) => {
        const className = classNames('button-menu__button', {
            'button-menu__button--active': val.value === value,
        });
        return (
            <Button
                key={idx}
                text={val.text}
                onClick={() => changeValue(val.value)}
                className={className}
            />
        );
    });
    return <div className='button-menu'>{menu}</div>;
};

ButtonToggleMenu.propTypes = {
    buttons_arr: PropTypes.array,
    onChange   : PropTypes.func,
};

export default ButtonToggleMenu;
