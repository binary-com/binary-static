import React     from 'react';
import PropTypes from 'prop-types';

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

Tooltip.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.string,
    is_icon  : PropTypes.bool,
    message  : PropTypes.string,
};

export default Tooltip;
