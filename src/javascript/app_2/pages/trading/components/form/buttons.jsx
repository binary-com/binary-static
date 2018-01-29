import React from 'react';

export const Btn = ({
    id,
    className='',
    text,
    is_ripple,
    handleClick,
}) => {
    const classes = `mdc-button${is_ripple ? ' mdc-button-ripple' : ''} ${className}`;
    return (
        <button id={id} className={classes} onClick={handleClick || undefined}>
            <span>{text}</span>
        </button>
    );
};

export default Btn;
