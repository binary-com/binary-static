import PropTypes from 'prop-types';
import React     from 'react';

const ErrorBox = ({ header, icon, message, children }) => (
    <div className='page-error__box'>
        {icon}
        <h3 className='page-error__header'>
            {header}
        </h3>
        <div>
            <p className='page-error__message'>{message}</p>
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
