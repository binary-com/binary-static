import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '../../../../_common/localize';

const LoginPrompt = ({ onLogin, onSignup, children }) => (
    <div className='login-prompt'>
        <div className='login-prompt__icon'>
            {children}
        </div>
        <div className='login-prompt__message'>
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

LoginPrompt.propTypes = {
    children: PropTypes.any,
    onLogin : PropTypes.func,
    onSignup: PropTypes.func,
};

export default LoginPrompt;

