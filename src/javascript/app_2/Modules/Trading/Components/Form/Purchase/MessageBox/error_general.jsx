import PropTypes from 'prop-types';
import React     from 'react';

const ErrorGeneral = ({ message }) => (
    <div className='info-text'>
        {message}
    </div>
);

ErrorGeneral.propTypes = {
    message: PropTypes.string,
};

export default ErrorGeneral;
