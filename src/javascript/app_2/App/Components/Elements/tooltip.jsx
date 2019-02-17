import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const Tooltip = ({
    alignment,
    children,
    className,
    classNameIcon,
    icon, // only question or info accepted
    message,
}) => {
    const icon_name = (icon === 'question' || icon === 'info' || icon === 'dot') ? icon : 'question';
    const icon_class = classNames(icon_name);
    return (
        <span className={classNames(className, 'tooltip')} data-tooltip={message} data-tooltip-pos={alignment}>
            {icon ?
                <i className={classNames(classNameIcon, icon_class)} />
                :
                children
            }
        </span>
    );
};

Tooltip.propTypes = {
    alignment    : PropTypes.string,
    children     : PropTypes.node,
    className    : PropTypes.string,
    classNameIcon: PropTypes.string,
    icon         : PropTypes.string,
    message      : PropTypes.string,
};

export default Tooltip;
