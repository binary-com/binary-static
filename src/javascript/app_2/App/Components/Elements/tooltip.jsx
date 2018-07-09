import React      from 'react';
import classNames from 'classnames';
import PropTypes  from 'prop-types';

const Tooltip = ({
    message,
    alignment,
    children,
    icon, // only question or info accepted
}) => {
    const icon_name = (icon === 'question' || icon === 'info') ? icon : 'question';
    const icon_class = classNames(icon_name);
    return (
        <span className='tooltip' data-tooltip={message} data-tooltip-pos={alignment}>
            {icon ?
                <i className={icon_class}/>
            :
                children
            }
        </span>
    );
};

Tooltip.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.string,
    icon     : PropTypes.string,
    message  : PropTypes.string,
};

export default Tooltip;
