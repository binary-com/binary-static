import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { localize }        from '_common/localize';
import Button              from '../../Form/button.jsx';

const DepositButton = ({ className }) => (
    <Button
        className={classNames(className, 'btn--primary btn--primary--orange')}
        has_effect
        text={localize('Deposit')}
        // TODO: Redirect to Deposit page in Cashier
        // onClick={redirectToCashierDeposit}
    />
);

DepositButton.propTypes = {
    className: PropTypes.string,
};

export { DepositButton };
