import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { CSSTransition }   from 'react-transition-group';
import { AccountSwitcher } from 'App/Containers/AccountSwitcher';
import { IconArrow }       from 'Assets/Common';

// todo fix absolute path

const AccountInfo = ({
    balance,
    currency,
    loginid,
    is_dialog_on,
    is_upgrade_enabled,
    is_virtual,
    onClickUpgrade,
    toggleDialog,
}) => (
    <div className='acc-balance'>
        <div className='acc-switcher-container'>
            <div
                className={classNames('acc-info', {
                    'acc-info--show'      : is_dialog_on,
                    'acc-info--is-virtual': is_virtual,
                })}
                onClick={toggleDialog}
            >
                <p
                    className='acc-balance-id'
                    title={loginid}
                >
                    {loginid}
                </p>
                {
                    typeof balance !== 'undefined' &&
                    <p className='acc-balance-amount'>
                        <span
                            className={classNames('symbols', (currency || '').toLowerCase())}
                        />
                        {balance}
                    </p>
                }
                <IconArrow className='select-arrow' />
            </div>
            <CSSTransition
                in={is_dialog_on}
                timeout={200}
                classNames={{
                    enter    : 'acc-switcher-wrapper--enter',
                    enterDone: 'acc-switcher-wrapper--enter-done',
                    exit     : 'acc-switcher-wrapper--exit',
                }}
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
    </div>
);

AccountInfo.propTypes = {
    account_type      : PropTypes.string,
    balance           : PropTypes.string,
    currency          : PropTypes.string,
    is_dialog_on      : PropTypes.bool,
    is_upgrade_enabled: PropTypes.bool,
    is_virtual        : PropTypes.bool,
    loginid           : PropTypes.string,
    onClickUpgrade    : PropTypes.func,
    toggleDialog      : PropTypes.func,
};

export { AccountInfo };
