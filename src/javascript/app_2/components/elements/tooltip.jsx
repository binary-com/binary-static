import React from 'react';

const Tooltip = ({
    message,
    alignment,
    children,
    is_icon,
}) => (
    <span className='tooltip' data-tooltip={message} data-tooltip-pos={alignment}>
        {is_icon ?
            <i className='question-mark'/>
        :
            children
        }
    </span>
);


export default Tooltip;
