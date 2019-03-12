import React               from 'react';
import { localize }        from '_common/localize';
import Button              from 'App/Components/Form/button.jsx';

const ErrorBalance = () => (
    <div className='message-box__login'>
        <span className='message-box__info message-box__login-info'>
            {localize('You have an insufficient amount of balance.')}
        </span>
        <Button
            className='btn--secondary btn--secondary--orange'
            has_effect
            text={localize('Deposit')}
        />
    </div>
);

export { ErrorBalance };
