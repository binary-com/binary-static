import PropTypes from 'prop-types';
import React     from 'react';

const Arrowback = ({ className }) => (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <path fill='#333' fillRule='nonzero' d='M3.6 8.5L7 12.2a.5.5 0 1 1-.8.6l-4-4.5a.5.5 0 0 1 0-.6l4-4.5a.5.5 0 0 1 .8.6L3.6 7.5h9.9a.5.5 0 1 1 0 1H3.6z'/>
    </svg>
);

Arrowback.propTypes = {
    className: PropTypes.string,
};

export default Arrowback;
