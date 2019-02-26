import PropTypes       from 'prop-types';
import React           from 'react';
import { withRouter }  from 'react-router';
import { formatMoney } from '_common/base/currency_base';
import {
    AccountInfo,
    DepositButton,
    InstallPWAButton,
    LoginButton,
    MenuLinks,
    ToggleMenuDrawer,
    UpgradeButton }    from 'App/Components/Layout/Header';
import header_links    from 'App/Constants/header-links';
import { connect }     from 'Stores/connect';

const Header = ({
    balance,
    can_upgrade,
    can_upgrade_to,
    currency,
    hideInstallButton,
    is_acc_switcher_on,
    is_install_button_visible,
    is_logged_in,
    is_mobile,
    is_virtual,
    loginid,
    onClickUpgrade,
    pwa_prompt_event,
    setPWAPromptEvent,
    showInstallButton,
    toggleAccountsDialog,
}) => {

    window.addEventListener('beforeinstallprompt', e => {
        console.log('Going to show the installation prompt'); // eslint-disable-line no-console

        e.preventDefault();

        setPWAPromptEvent(e);
        showInstallButton();

    });

    return (
        <header className='header'>
            <div className='menu-items'>
                <div className='menu-left'>
                    {is_mobile && <ToggleMenuDrawer />}
                    <MenuLinks items={header_links} />
                </div>
                <div className='menu-right'>
                    <div className='acc-info__container'>
                        { is_install_button_visible && is_logged_in &&
                            <InstallPWAButton
                                className='acc-info__button'
                                prompt_event={pwa_prompt_event}
                                onClick={hideInstallButton}
                            />
                        }
                        { is_logged_in ?
                            <React.Fragment>
                                <AccountInfo
                                    balance={formatMoney(currency, balance, true)}
                                    is_upgrade_enabled={can_upgrade}
                                    is_virtual={is_virtual}
                                    onClickUpgrade={onClickUpgrade}
                                    currency={currency}
                                    loginid={loginid}
                                    is_dialog_on={is_acc_switcher_on}
                                    toggleDialog={toggleAccountsDialog}
                                />
                                { !!(can_upgrade_to && is_virtual) &&
                                <UpgradeButton className='acc-info__button' />
                                }
                                { !(is_virtual) &&
                                <DepositButton className='acc-info__button' />
                                }
                            </React.Fragment>
                            :
                            <LoginButton className='acc-info__button' />
                        }
                    </div>
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    balance                  : PropTypes.string,
    can_upgrade              : PropTypes.bool,
    can_upgrade_to           : PropTypes.string,
    currency                 : PropTypes.string,
    hideInstallButton        : PropTypes.func,
    is_acc_switcher_on       : PropTypes.bool,
    is_dark_mode             : PropTypes.bool,
    is_install_button_visible: PropTypes.bool,
    is_logged_in             : PropTypes.bool,
    is_mobile                : PropTypes.bool,
    is_virtual               : PropTypes.bool,
    loginid                  : PropTypes.string,
    onClickUpgrade           : PropTypes.func,
    pwa_prompt_event         : PropTypes.object, // TODO: add click handler
    setPWAPromptEvent        : PropTypes.func,
    showInstallButton        : PropTypes.func,
    toggleAccountsDialog     : PropTypes.func,
};

// need to wrap withRouter around connect
// to prevent updates on <MenuLinks /> from being blocked
export default withRouter(connect(
    ({ client, ui }) => ({
        balance                  : client.balance,
        can_upgrade              : client.can_upgrade,
        can_upgrade_to           : client.can_upgrade_to,
        currency                 : client.currency,
        is_logged_in             : client.is_logged_in,
        is_virtual               : client.is_virtual,
        loginid                  : client.loginid,
        hideInstallButton        : ui.hideInstallButton,
        is_acc_switcher_on       : ui.is_accounts_switcher_on,
        is_dark_mode             : ui.is_dark_mode_on,
        is_install_button_visible: ui.is_install_button_visible,
        is_mobile                : ui.is_mobile,
        pwa_prompt_event         : ui.pwa_prompt_event,
        setPWAPromptEvent        : ui.setPWAPromptEvent,
        showInstallButton        : ui.showInstallButton,
        toggleAccountsDialog     : ui.toggleAccountsDialog,
    })
)(Header));
