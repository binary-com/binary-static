import PropTypes    from 'prop-types';
import React        from 'react';
import IconError    from 'Assets/Common/icon_error.jsx';
import { localize } from '_common/localize';

const ErrorComponent = ({ type, message }) => (
    <div className='error-container'>
        <IconError type={type} />
        <p>{message || localize('Sorry, an error occured while processing your request.')}</p>
    </div>
);

ErrorComponent.propTypes = {
    message: PropTypes.node,
    type   : PropTypes.string,
};

export default ErrorComponent;
