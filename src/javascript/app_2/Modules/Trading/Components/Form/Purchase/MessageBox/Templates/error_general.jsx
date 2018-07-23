import PropTypes from 'prop-types';
import React     from 'react';

const ErrorGeneral = ({ message }) => (
    <div className='purchase-error-wrapper'>
        <span className='info-text'>{message}</span>
    </div>
);

ErrorGeneral.propTypes = {
    message: PropTypes.string,
};

export { ErrorGeneral };
