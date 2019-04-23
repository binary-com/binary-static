import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const TooltipBubble = ({
    alignment,
    style,
    message,
}) => ReactDOM.createPortal(
    <span
        style={style}
        className={classNames(
            'tooltip-2',
            `tooltip-2--${alignment}`,
        )}
    >
        <span className={classNames(
            'tooltip-2-arrow',
            `tooltip-2-arrow--${alignment}`,
        )}
        />
        { message }
    </span>,
    document.getElementById('binary_app')
);

export default TooltipBubble;
