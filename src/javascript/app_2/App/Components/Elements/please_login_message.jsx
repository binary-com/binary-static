import React        from 'react';
import { localize } from '../../../../_common/localize';

const PleaseLoginMessage = ({ onLogin, onSignup }) => (
    <div className='please-login'>
        <div className='please-login__message'>
            {localize('Please')}
            &nbsp;
            <a href='javascript:;' onClick={onLogin}>
                {localize('log in')}
            </a>
            &nbsp;
            {localize('or')}
            &nbsp;
            <a href='javascript:;' onClick={onSignup}>
                {localize('sign up')}
            </a>
            &nbsp;
            {localize('to view this page.')}
        </div>
    </div>
);

export default PleaseLoginMessage;

