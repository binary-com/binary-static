import React               from 'react';
import { localize }        from '_common/localize';
import Button              from 'App/Components/Form/button.jsx';

const ErrorBalance = () => (
    <div className='purchase-container__error-login'>
        <span className='purchase-container__error-info purchase-container__error-login-info'>{localize('You have an insufficient amount of balance.')}</span>
        <Button
            className='purchase-container__error-login-btn btn--secondary btn--secondary--orange'
            classNameSpan='purchase-container__error-login-btn-span'
            has_effect
            text={localize('Deposit')}
        />
    </div>
);

export { ErrorBalance };
