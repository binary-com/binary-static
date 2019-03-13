import PropTypes from 'prop-types';
import React     from 'react';

const ErrorGeneral = ({ message }) => (
    <div className='message-box__result'>
        <span className='message-box__info'>{message}</span>
    </div>
);

ErrorGeneral.propTypes = {
    message: PropTypes.string,
};

export { ErrorGeneral };
