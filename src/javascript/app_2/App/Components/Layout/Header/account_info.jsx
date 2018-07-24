import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '../../../../../_common/localize';

const AccountInfo = ({ balance, currency, loginid }) => (
    <div className='acc-balance'>
        <div className='acc-info'>
            <p className='acc-balance-currency'>{`${(currency || '').toUpperCase()} ${localize('Account')}`}</p>
            <p className='acc-balance-accountid'>{loginid}</p>
        </div>
        { typeof balance !== 'undefined' &&
            <p className='acc-balance-amount'>
                <i><span className={`symbols ${(currency || '').toLowerCase()}`}/></i>
                {balance}
            </p>
        }
    </div>
);

AccountInfo.propTypes = {
    balance : PropTypes.string,
    currency: PropTypes.string,
    loginid : PropTypes.string,
};

export { AccountInfo };