import PropTypes  from 'prop-types';
import React      from 'react';

const IconCalendarToday = ({ className, onClick }) => (
    <svg
        className={className || undefined}
        onClick={onClick}
        width='16'
        height='16'
        viewBox='0 0 16 16'
    >
        <g fill='none'>
            <path stroke='#000' strokeLinecap='round' strokeLinejoin='round' d='M1.5 5.5v-2a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-12' />
            <rect width='1' height='3' x='4' y='1' fill='#000' rx='.5' />
            <rect width='1' height='3' x='11' y='1' fill='#000' rx='.5' />
            <path fill='#000' d='M1 5h13v1H1z' />
            <path stroke='#000' strokeLinecap='round' strokeLinejoin='round' d='M3.5 7.5L1 10l2.5 2.5M1 10h6.5' />
        </g>
    </svg>
);

IconCalendarToday.propTypes = {
    className: PropTypes.string,
};

export { IconCalendarToday };
