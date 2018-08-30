import { CSSTransition } from 'react-transition-group';
import PropTypes         from 'prop-types';
import React             from 'react';
import AccountSwitcher   from '../../Elements/account_switcher2.jsx';
import { localize }      from '../../../../../_common/localize';

const AccountInfo = ({ balance, currency, loginid, is_dialog_on, toggleDialog }) => (
    <div className='acc-switcher' onClick={toggleDialog}>
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
        <CSSTransition
            in={is_dialog_on}
            timeout={400}
            classNames='acc-switcher-wrapper'
            unmountOnExit
        >
            <div className='acc-switcher-wrapper'>
                <AccountSwitcher
                    toggle={toggleDialog}
                />
            </div>
        </CSSTransition>
    </div>
);

AccountInfo.propTypes = {
    balance     : PropTypes.string,
    currency    : PropTypes.string,
    loginid     : PropTypes.string,
    is_dialog_on: PropTypes.bool,
    toggleDialog: PropTypes.func,
};

export { AccountInfo };
