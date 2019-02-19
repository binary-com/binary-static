import PropTypes from 'prop-types';
import React     from 'react';

const IconInfoLight = ({ className }) => (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
        <path fill='rgba(0, 0, 0, 0.8)' fillRule='evenodd' d='M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM8 6a.75.75 0 1 0 0-1.5A.75.75 0 0 0 8 6zm0 1a.5.5 0 0 0-.5.5v4a.5.5 0 1 0 1 0v-4A.5.5 0 0 0 8 7z' />
    </svg>
);

IconInfoLight.propTypes = {
    className: PropTypes.string,
};

export { IconInfoLight };
