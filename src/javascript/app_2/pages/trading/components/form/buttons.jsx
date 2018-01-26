import React from 'react';

export const MdcButton = ({
    id,
    className='',
    text,
    is_ripple,
    /* To do: add property styles for constants/default values */
    font_size = '18px',
    textColor = 'white',
    bgColor = '#2e8836',
    handleClick,
}) => {
    const classes = `${is_ripple ? `mdc-button mdc-button-ripple ${className}` : `mdc-button ${className}`}`;
    return (
        <button id={id} className={classes} style={{ background: bgColor  }} onClick={handleClick}>
            <span style={{ fontSize: font_size, color: textColor }}>{text}</span>
        </button>
    );
};

export default MdcButton;
