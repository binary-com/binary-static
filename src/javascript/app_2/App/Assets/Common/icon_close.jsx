import PropTypes from 'prop-types';
import React     from 'react';

const IconClose = ({ className }) => (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
        <g fill='none' fillRule='evenodd'>
            <path d='M0 0h16v16H0z'/>
            <path fill='#2A3052' fillRule='nonzero' d='M8 6.6l4.3-4.3 1.4 1.4L9.4 8l4.3 4.3-1.4 1.4L8 9.4l-4.3 4.3-1.4-1.4L6.6 8 2.3 3.7l1.4-1.4L8 6.6z'/>
        </g>
    </svg>
);

IconClose.propTypes = {
    className: PropTypes.string,
};

export { IconClose };
