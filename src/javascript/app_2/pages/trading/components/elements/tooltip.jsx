import React from 'react';

const Tooltip = ({
    message,
    alignment,
}) => (
    <span className='tooltip' data-tooltip={message} data-tooltip-pos={alignment}>
        <i className='question-mark'/>
    </span>
);


export default Tooltip;
