import React               from 'react';
import { redirectToLogin } from '_common/base/login';
import { localize }        from '_common/localize';
import Button              from 'App/Components/Form/button.jsx';

const ErrorLogin = () => (
    <div className='purchase-container__error-login'>
        <span className='purchase-container__error-info purchase-container__error-login-info'>{localize('Please log in to purchase the contract')}</span>
        <Button
            className='purchase-container__error-login-btn btn--secondary btn--secondary--orange'
            classNameSpan='purchase-container__error-login-btn-span'
            has_effect
            text={localize('log in')}
            onClick={redirectToLogin}
        />
        <p className='purchase-container__error-login-prompt'>{localize('Don\'t have a [_1] account?', ['Binary.com'])}</p>
        <a className='purchase-container__error-login-link' href='javascript:;'><span className='purchase-container__error-info purchase-container__error-login-info'>{localize('Create one now')}</span></a>
    </div>
);

export { ErrorLogin };
