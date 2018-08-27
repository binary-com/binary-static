import PropTypes               from 'prop-types';
import React                   from 'react';
import { withRouter }          from 'react-router';
import {
    AccountInfo,
    LoginButton,
    MenuLinks,
    ToggleMenuDrawer,
    ToggleNotificationsDrawer,
    UpgradeButton }            from '../../Components/Layout/Header';
import header_links            from '../../Constants/header_links';
import { connect }             from '../../../Stores/connect';
import { formatMoney }         from '../../../../_common/base/currency_base';

const Header = ({
    balance,
    can_upgrade,
    currency,
    loginid,
    is_logged_in,
    onClickUpgrade,
}) => (
    <header className='header'>
        <div className='menu-items'>
            <div className='menu-left'>
                <ToggleMenuDrawer />
                <MenuLinks items={header_links} />
            </div>
            <div className='menu-right'>
                <div className='acc-balance-container'>
                    { is_logged_in ?
                        <React.Fragment>
                            <AccountInfo
                                balance={formatMoney(currency, balance, true)}
                                currency={currency}
                                loginid={loginid}
                            />
                            { can_upgrade && <UpgradeButton onClick={onClickUpgrade} /> }
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
    balance       : PropTypes.string,
    can_upgrade   : PropTypes.bool,
    currency      : PropTypes.string,
    loginid       : PropTypes.string,
    is_dark_mode  : PropTypes.bool, // TODO: add dark theme handler
    is_logged_in  : PropTypes.bool,
    onClickUpgrade: PropTypes.func, // TODO: add click handler
};

// need to wrap withRouter around connect
// to prevent updates on <MenuLinks /> from being blocked
export default withRouter(connect(
    ({ ui, client }) => ({
        is_dark_mode: ui.is_dark_mode_on,
        balance     : client.balance,
        can_upgrade : client.can_upgrade,
        currency    : client.currency,
        loginid     : client.loginid,
        is_logged_in: client.is_logged_in,
    })
)(Header));
