import PropTypes from 'prop-types';
import React     from 'react';

export default function CalendarButton({ children, className, is_hidden, label, onClick }) {
    return (
        <React.Fragment>
            { !is_hidden &&
                <span
                    type='button'
                    className={className}
                    onClick={onClick}
                >
                    {label}
                    {children}
                </span> 
            }
        </React.Fragment>
    );
}

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