import React               from 'react';
import Button              from '../../../../../../App/Components/Form/button.jsx';
import { localize }        from '../../../../../../../_common/localize';

const ErrorBalance = () => (
    <div className='purchase-login-wrapper'>
        <span className='info-text'>{localize('You have an insufficient amount of balance.')}</span>
        <Button
            className='secondary orange'
            has_effect
            text={localize('deposit')}
        />
    </div>
);

export default ErrorBalance;
