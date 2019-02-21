import PropTypes from 'prop-types';
import React     from 'react';

const ErrorGeneral = ({ message }) => (
    <div className='purchase-container__error-result'>
        <span className='purchase-container__error-info'>{message}</span>
    </div>
);

ErrorGeneral.propTypes = {
    message: PropTypes.string,
};

export { ErrorGeneral };
