import React               from 'react';
import { redirectToLogin } from '_common/base/login';
import { localize }        from '_common/localize';
import Button              from 'App/Components/Form/button.jsx';

const ErrorLogin = () => (
    <div className='message-box__login'>
        <span className='message-box__info message-box__login-info'>
            {localize('Please log in to purchase the contract')}
        </span>
        <Button
            className='btn--secondary btn--secondary--orange'
            has_effect
            text={localize('log in')}
            onClick={redirectToLogin}
        />
        <p className='message-box__login-prompt'>{localize('Don\'t have a [_1] account?', ['Binary.com'])}</p>
        <a className='message-box__login-link' href='javascript:;'>
            <span className='message-box__info message-box__login-info'>
                {localize('Create one now')}
            </span>
        </a>
    </div>
);

export { ErrorLogin };
