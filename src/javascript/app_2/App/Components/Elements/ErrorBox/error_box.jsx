import PropTypes from 'prop-types';
import React     from 'react';

const ErrorBox = ({ header, icon, message, children }) => (
    <div className='page-error-box'>
        {icon}
        <h1 className='page-error-header'>
            {header}
        </h1>
        <div className='page-error-message'>
            <p>{message}</p>
        </div>
        {children}
    </div>
);

ErrorBox.propTypes = {
    children: PropTypes.node,
    header  : PropTypes.string,
    icon    : PropTypes.node,
    message : PropTypes.string,
};

export default ErrorBox;
