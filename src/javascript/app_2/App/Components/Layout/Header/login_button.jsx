import React               from 'react';
import Button              from '../../Form/button.jsx';
import { localize }        from '../../../../../_common/localize';
import { redirectToLogin } from '../../../../../_common/base/login';

const LoginButton = () => (
    <Button
        className='primary orange'
        has_effect
        text={localize('Log in')}
        onClick={redirectToLogin}
    />
);

export { LoginButton };