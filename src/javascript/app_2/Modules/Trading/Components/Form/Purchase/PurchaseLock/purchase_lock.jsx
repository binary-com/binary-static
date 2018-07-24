import React           from 'react';
import PropTypes       from 'prop-types';
import Button          from '../../../../../../App/Components/Form/button.jsx';
import { localize }    from '../../../../../../../_common/localize';
import LockIcon       from '../../../../../../App/Components/Elements/lock_icon.jsx';

const PurchaseLock = ({ onClick }) => (
    <div className='purchase-lock-container'>
        <div className='lock-container'>
            <LockIcon className='ic-lock' />
        </div>
        <h4>{localize('Purchase Locked')}</h4>
        <Button
            className='flat secondary orange'
            has_effect
            onClick={onClick}
            text={localize('Unlock')}
        />
        <span className='lock-message'>
            {localize('You can lock/unlock the purchase button from the Settings menu')}
        </span>
    </div>
);

PurchaseLock.propTypes = {
    onClick: PropTypes.func,
};

export default PurchaseLock;
