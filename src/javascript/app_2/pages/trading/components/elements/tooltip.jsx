import React from 'react';

const Tooltip = ({
    message,
    alignment='top',
}) => (
    <span className={`tooltip ${alignment}`} data-tooltip={message}>
        <i className='question-mark'/>
    </span>
);


export default Tooltip;
