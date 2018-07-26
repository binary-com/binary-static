import React         from 'react';
import { ErrorIcon } from './error_icon.jsx';
import { localize }  from '../../../../../_common/localize';

const ErrorComponent = ({ type, message }) => (
    <div className='error-container'>
        <ErrorIcon type={type} />
        <p>{localize(message || 'Sorry, an error occured while processing your request.')}</p>
    </div>
);

export default ErrorComponent;