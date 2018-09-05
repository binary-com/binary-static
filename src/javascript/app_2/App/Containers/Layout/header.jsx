import PropTypes                from 'prop-types';
import React                    from 'react';
import { withRouter }           from 'react-router';
import { formatMoney }          from '_common/base/currency_base';
import { connect }              from 'Stores/connect';
import {
    AccountInfo,
    LoginButton,
    MenuLinks,
    ToggleMenuDrawer,
    ToggleNotificationsDrawer } from '../../Components/Layout/Header';
import header_links             from '../../Constants/header_links';

const Header = ({
    balance,
    can_upgrade,
    currency,
    loginid,
    is_acc_switcher_on,
    is_logged_in,
    is_mobile,
    onClickUpgrade,
    toggleAccountsDialog,
}) => (
    <header className='header'>
        <div className='menu-items'>
            <div className='menu-left'>
                {is_mobile && <ToggleMenuDrawer />}
                <MenuLinks items={header_links} />
            </div>
            <div className='menu-right'>
                <div className='acc-balance-container'>
                    { is_logged_in ?
                        <React.Fragment>
                            <AccountInfo
                                balance={formatMoney(currency, balance, true)}
                                is_upgrade_enabled={can_upgrade}
                                onClickUpgrade={onClickUpgrade}
                                currency={currency}
                                loginid={loginid}
                                is_dialog_on={is_acc_switcher_on}
                                toggleDialog={toggleAccountsDialog}
                            />
                        </React.Fragment>
                        :
                        <LoginButton />
                    }
                </div>
            </div>
            <ToggleNotificationsDrawer />
        </div>
    </header>
);

Header.propTypes = {
    balance             : PropTypes.string,
    can_upgrade         : PropTypes.bool,
    currency            : PropTypes.string,
    is_acc_switcher_on  : PropTypes.bool,
    is_dark_mode        : PropTypes.bool, // TODO: add dark theme handler
    is_logged_in        : PropTypes.bool,
    is_mobile           : PropTypes.bool,
    loginid             : PropTypes.string,
    onClickUpgrade      : PropTypes.func, // TODO: add click handler
    toggleAccountsDialog: PropTypes.func,
};

// need to wrap withRouter around connect
// to prevent updates on <MenuLinks /> from being blocked
export default withRouter(connect(
    ({ ui, client }) => ({
        balance             : client.balance,
        can_upgrade         : client.can_upgrade,
        currency            : client.currency,
        is_logged_in        : client.is_logged_in,
        loginid             : client.loginid,
        is_acc_switcher_on  : ui.is_accounts_switcher_on,
        is_dark_mode        : ui.is_dark_mode_on,
        is_mobile           : ui.is_mobile,
        toggleAccountsDialog: ui.toggleAccountsDialog,
    })
)(Header));
