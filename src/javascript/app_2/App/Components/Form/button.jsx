import PropTypes from 'prop-types';
import React     from 'react';

const Button = ({
    className = '',
    children,
    has_effect,
    id,
    is_disabled,
    onClick,
    text,
    wrapperClassName,
}) => {
    const classes = `btn${has_effect ? ' effect' : ''} ${className}`;
    const button = (
        <button id={id} className={classes} onClick={onClick || undefined} disabled={is_disabled}>
            <span>{text}</span>
            {children}
        </button>
    );
    const wrapper = (<div className={wrapperClassName}>{button}</div>);

    return wrapperClassName ? wrapper : button;
};

Button.propTypes = {
    className       : PropTypes.string,
    children        : PropTypes.object,
    has_effect      : PropTypes.bool,
    id              : PropTypes.string,
    is_disabled     : PropTypes.bool,
    onClick         : PropTypes.func,
    text            : PropTypes.string,
    wrapperClassName: PropTypes.string,
};

export default Button;
