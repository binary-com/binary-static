import React               from 'react';
import { localize }        from '_common/localize';
import Button              from 'App/Components/Form/button.jsx';

const ErrorBalance = () => (
    <div className='purchase-login-wrapper'>
        <span className='info-text'>{localize('You have an insufficient amount of balance.')}</span>
        <Button
            className='secondary orange'
            has_effect
            text={localize('Deposit')}
        />
    </div>
);

export { ErrorBalance };
