import React from 'react';

export const MdcButton = ({
    id,
    className='',
    text,
    is_ripple,
    handleClick,
}) => {
    const classes = `${is_ripple ? `mdc-button mdc-button-ripple ${className}` : `mdc-button ${className}`}`;
    return (
        <button id={id} className={classes} onClick={handleClick}>
            <span>{text}</span>
        </button>
    );
};

export default MdcButton;
