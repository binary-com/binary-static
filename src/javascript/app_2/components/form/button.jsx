import React from 'react';

const Button = ({
    id,
    className = '',
    text,
    icon,
    has_effect,
    is_disabled,
    handleClick,
}) => {
    const classes = `btn${has_effect ? ' effect' : ''} ${className}`;
    return (
        <button id={id} className={classes} onClick={handleClick || undefined} disabled={is_disabled}>
            {!!icon &&
                <img className='btn-icon' src={icon} />
            }
            <span>{text}</span>
        </button>
    );
};

export default Button;
