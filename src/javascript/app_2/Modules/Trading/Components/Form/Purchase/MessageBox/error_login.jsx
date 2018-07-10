import React               from 'react';
import Button              from '../../../../../../App/Components/Form/button.jsx';
import { redirectToLogin } from '../../../../../../../_common/base/login';
import { localize }        from '../../../../../../../_common/localize';

const ErrorLogin = () => (
    <div className='purchase-login-wrapper'>
        <span className='info-text'>{localize('Please log in to purchase the contract')}</span>
        <Button
            className='secondary orange'
            has_effect
            text={localize('log in')}
            onClick={redirectToLogin}
        />
        <p>{localize('Don\'t have a [_1] account?', ['Binary.com'])}</p>
        <a href='javascript:;'><span className='info-text'>{localize('Create one now')}</span></a>
    </div>
);

export default ErrorLogin;
