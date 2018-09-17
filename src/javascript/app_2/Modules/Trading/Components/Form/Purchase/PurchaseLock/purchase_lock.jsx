import React           from 'react';
import PropTypes       from 'prop-types';
import { localize }    from '_common/localize';
import Button          from 'App/Components/Form/button.jsx';
import { IconLock }    from 'Assets/Trading/icon_lock.jsx';

const PurchaseLock = ({ onClick }) => (
    <div className='purchase-lock-container'>
        <div className='lock-container'>
            <IconLock className='ic-lock' />
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
