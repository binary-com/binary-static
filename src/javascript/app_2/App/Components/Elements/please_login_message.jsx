import React        from 'react';
import { localize } from '../../../../_common/localize';

const PleaseLoginMessage = ({ onLogin }) => (
    <div className='login-message-wrapper'>
        <div className='message'>
            <a href='javascript:;' onClick={onLogin}>{localize('Please login to view this page.')}</a>
        </div>
    </div>
);

export default PleaseLoginMessage;
