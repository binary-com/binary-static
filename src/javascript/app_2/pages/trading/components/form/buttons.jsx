import React from 'react';

export const MdcButton = ({
    id,
    className='',
    text,
    is_ripple,
    handleClick,
}) => {
    const classes = `mdc-button${is_ripple ? ' mdc-button-ripple' : ''} ${className}`;
    return (
        <button id={id} className={classes} onClick={handleClick}>
            <span>{text}</span>
        </button>
    );
};

export default MdcButton;
