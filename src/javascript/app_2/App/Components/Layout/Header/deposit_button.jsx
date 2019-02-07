import React               from 'react';
import { localize }        from '_common/localize';
import Button              from '../../Form/button.jsx';

const DepositButton = () => (
    <Button
        className='primary orange'
        has_effect
        text={localize('Deposit')}
        // TODO: Redirect to Deposit page in Cashier
        // onClick={redirectToCashierDeposit}
    />
);

export { DepositButton };
