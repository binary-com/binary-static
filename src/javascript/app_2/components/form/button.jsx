import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
    id,
    className = '',
    text,
    has_effect,
    is_disabled,
    handleClick,
}) => {
    const classes = `btn${has_effect ? ' effect' : ''} ${className}`;
    return (
        <button id={id} className={classes} onClick={handleClick || undefined} disabled={is_disabled}>
            <span>{text}</span>
        </button>
    );
};

Button.propTypes = {
    className  : PropTypes.string,
    handleClick: PropTypes.func,
    has_effect : PropTypes.bool,
    id         : PropTypes.string,
    is_disabled: PropTypes.bool,
    text       : PropTypes.string,
};

export default Button;
