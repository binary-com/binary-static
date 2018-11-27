import React               from 'react';
import { redirectToLogin } from '_common/base/login';
import { localize }        from '_common/localize';
import Button              from '../../Form/button.jsx';

const LoginButton = () => (
    <Button
        className='secondary orange'
        has_effect
        text={localize('Log in')}
        onClick={redirectToLogin}
    />
);

export { LoginButton };
