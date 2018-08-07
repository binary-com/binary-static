import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '../../../../_common/localize';

const PleaseLoginMessage = ({ onLogin, onSignup, children }) => (
    <div className='please-login'>
        <div className='please-login__icon'>
            {children}
        </div>
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

PleaseLoginMessage.propTypes = {
    children: PropTypes.any,
    onLogin : PropTypes.func,
    onSignup: PropTypes.func,
};

export default PleaseLoginMessage;

