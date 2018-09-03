import classNames        from 'classnames';
import { CSSTransition } from 'react-transition-group';
import PropTypes         from 'prop-types';
import React             from 'react';
import AccountSwitcher   from '../../Elements/account_switcher.jsx';
import { IconArrow }     from '../../../../Assets/Common';
import { localize }      from '../../../../../_common/localize';

const AccountInfo = ({ balance, currency, loginid, is_dialog_on, toggleDialog }) => (
    <div className='acc-balance'>
        <div className='acc-switcher-container'>
            <div className={classNames('acc-info', { 'show': is_dialog_on })} onClick={toggleDialog}>
                <p className='acc-balance-currency'>{`${(currency || '').toUpperCase()} ${localize('Account')}`}</p>
                <p className='acc-balance-accountid'>{loginid}</p>
                <IconArrow className='select-arrow' />
            </div>
            <CSSTransition
                in={is_dialog_on}
                timeout={400}
                classNames='acc-switcher-wrapper'
                unmountOnExit
            >
                <div className='acc-switcher-wrapper'>
                    <AccountSwitcher
                        is_visible={is_dialog_on}
                        toggle={toggleDialog}
                    />
                </div>
            </CSSTransition>
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
    balance     : PropTypes.string,
    currency    : PropTypes.string,
    loginid     : PropTypes.string,
    is_dialog_on: PropTypes.bool,
    toggleDialog: PropTypes.func,
};

export { AccountInfo };
