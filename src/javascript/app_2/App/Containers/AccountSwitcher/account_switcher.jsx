import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import { IconLogout }    from 'Assets/Header/Drawer';
import { requestLogout } from 'Services/index';
import { connect }       from 'Stores/connect';

class AccountSwitcher extends React.Component {
    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    handleClickOutside = (event) => {
        const accounts_toggle_btn = !(event.target.classList.contains('acc-info'));
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)
            && this.props.is_visible && accounts_toggle_btn) {
            this.props.toggle();
        }
    };

    handleLogout = () => {
        this.props.toggle();
        if (this.props.is_positions_drawer_on) {
            this.props.togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
        }
        requestLogout();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    async doSwitch(loginid) {
        this.props.toggle();
        if (this.props.account_loginid === loginid) return;
        await this.props.switchAccount(loginid);
    }

    render() {
        if (!this.props.is_logged_in) return false;
        // TODO: Once we allow other real accounts (apart from CR), assign correct title and group accounts into list with correct account title/types
        // e.g - Real, Financial, Gaming, Investment

        const main_account_title = localize('Real account');

        return (
            <div className='acc-switcher__list' ref={this.setWrapperRef}>
                {
                    // Make sure this block is not rendered if there are no real accounts
                    !!(this.props.account_list.length > 0 && !(this.props.account_list[0].is_virtual)) &&
                    <div className='acc-switcher__list__group'>
                        <span className='acc-switcher__list__title'>
                            {main_account_title}
                        </span>
                        {
                            this.props.account_list.filter((accounts) => !accounts.is_virtual).map((account) => (
                                <React.Fragment key={account.loginid}>
                                    <div
                                        className={classNames('acc-switcher-account', {
                                            'acc-switcher-account--selected': (account.loginid === this.props.account_loginid),
                                        })}
                                        onClick={this.doSwitch.bind(this, account.loginid)}
                                    >
                                        <span
                                            className={classNames('acc-switcher__id', {
                                                'acc-switcher__id__icon': account.icon,
                                            },
                                            `acc-switcher__id__icon--${account.icon}`)}
                                        >
                                            {account.loginid}
                                        </span>
                                        <span className='acc-switcher__radio' />
                                    </div>
                                </React.Fragment>
                            ))}

                        {   // TODO: Add link to account opening page for upgrade or multi account page for new account.
                            // Update text below for handling types of account to create :- e.g - Investment
                            !!(this.props.is_upgrade_enabled && this.props.upgrade_info.can_open_multi) &&
                            <div className='acc-switcher__new-account'>
                                <span>{localize('Add new account')}</span>
                            </div>
                        }
                    </div>
                }
                <div className='acc-switcher__list__virtual'>
                    <span className='acc-switcher__list__title'>
                        {localize('Virtual account')}
                    </span>
                    <div
                        className={classNames('acc-switcher-account', {
                            'acc-switcher-account--selected': (this.props.virtual_loginid === this.props.account_loginid),
                        })}
                        onClick={this.doSwitch.bind(this, this.props.virtual_loginid)}
                    >
                        <span className={classNames('acc-switcher__id', 'virtual')}>
                            {this.props.virtual_loginid}
                        </span>
                        <span className='acc-switcher__radio' />
                    </div>
                </div>
                { !!(this.props.is_upgrade_enabled && this.props.is_virtual) &&
                <div className='acc-switcher__new-account'>
                    <span>{localize('Upgrade to Real Account')}</span>
                </div>
                }
                <div className='acc-logout' onClick={this.handleLogout}>
                    <span className='acc-logout__text'>{localize('Log out')}</span>
                    <IconLogout className='drawer-icon' />
                </div>
            </div>
        );
    }
}

AccountSwitcher.propTypes = {
    account_list          : PropTypes.array,
    account_loginid       : PropTypes.string,
    is_logged_in          : PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_upgrade_enabled    : PropTypes.bool,
    is_virtual            : PropTypes.bool,
    is_visible            : PropTypes.bool,
    onClickUpgrade        : PropTypes.func,
    toggle                : PropTypes.func,
    togglePositionsDrawer : PropTypes.func,
    upgrade_info          : PropTypes.object,
    virtual_loginid       : PropTypes.string,
};

const account_switcher = connect(
    ({ client, ui }) => ({
        account_list          : client.account_list,
        account_loginid       : client.loginid,
        is_logged_in          : client.is_logged_in,
        is_virtual            : client.is_virtual,
        switchAccount         : client.switchAccount,
        upgrade_info          : client.upgrade_info,
        virtual_loginid       : client.virtual_account_loginid,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        togglePositionsDrawer : ui.togglePositionsDrawer,

    }),
)(AccountSwitcher);

export { account_switcher as AccountSwitcher };
