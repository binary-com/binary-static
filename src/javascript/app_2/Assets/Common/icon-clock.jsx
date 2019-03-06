import PropTypes from 'prop-types';
import React     from 'react';

const IconClock = ({ className, onClick }) => (
    <svg
       
        width='16'
        height='16'
        className={className}
        onClick={onClick}
    >
        <g fill='none' fillRule='nonzero' stroke='#5C5C5C'>
            <circle cx='8' cy='8' r='7.5' />
            <path strokeLinecap='round' strokeLinejoin='round' d='M8 3.5v5h3.5' />
        </g>
    </svg>
);

IconClock.propTypes = {
    className: PropTypes.string,
    onClick  : PropTypes.func,
};

export { IconClock };
