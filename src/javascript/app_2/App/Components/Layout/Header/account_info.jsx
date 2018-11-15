import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { CSSTransition }   from 'react-transition-group';
import { localize }        from '_common/localize';
import { AccountSwitcher } from 'App/Containers/AccountSwitcher';
import { IconArrow }       from 'Assets/Common';


const AccountInfo = ({
    balance,
    currency,
    loginid,
    is_dialog_on,
    is_upgrade_enabled,
    onClickUpgrade,
    toggleDialog,
    account_type,
}) => (
    <div className='acc-balance'>
        <div className='acc-switcher-container'>
            <div className={classNames('acc-info', { 'show': is_dialog_on })} onClick={toggleDialog}>
                <p className='acc-balance-type'>{localize('[_1] Account', [(account_type || '')])}</p>
                <p className='acc-balance-id'>{loginid}</p>
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
                        is_upgrade_enabled={is_upgrade_enabled}
                        onClickUpgrade={onClickUpgrade}
                    />
                </div>
            </CSSTransition>
        </div>
        {typeof balance !== 'undefined' &&
        <p className='acc-balance-amount'>
            <i><span className={`symbols ${(currency || '').toLowerCase()}`} /></i>
            {balance}
        </p>
        }
    </div>
);

AccountInfo.propTypes = {
    account_type      : PropTypes.string,
    balance           : PropTypes.string,
    currency          : PropTypes.string,
    is_dialog_on      : PropTypes.bool,
    is_upgrade_enabled: PropTypes.bool,
    loginid           : PropTypes.string,
    onClickUpgrade    : PropTypes.func,
    toggleDialog      : PropTypes.func,
};

export { AccountInfo };
