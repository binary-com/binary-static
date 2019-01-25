import PropTypes from 'prop-types';
import React     from 'react';

const CalendarButton = ({
    children,
    className,
    is_hidden,
    label,
    onClick,
}) => (
    <React.Fragment>
        { !is_hidden &&
            <button
                className={className}
                onClick={onClick}
            >
                {label}
                {children}
            </button>
        }
    </React.Fragment>
);

CalendarButton.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
        PropTypes.string,
    ]),
    className: PropTypes.string,
    is_hidden: PropTypes.bool,
    label    : PropTypes.string,
    onClick  : PropTypes.func,
};

export default CalendarButton;
