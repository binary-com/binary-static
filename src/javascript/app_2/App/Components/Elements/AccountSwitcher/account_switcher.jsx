import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import { IconLogout }    from 'Assets/Header/Drawer';
import { requestLogout } from 'Services';
import { connect }       from 'Stores/connect';
import { UpgradeButton } from './upgrade_button.jsx';

const getAccountInfo = (loginid, client) => {
    const currency     = client.get('currency', loginid);
    const is_virtual   = client.get('is_virtual', loginid);
    const account_type = !is_virtual && currency ? currency : client.getAccountTitle(loginid);

    return {
        loginid,
        is_virtual,
        icon : account_type.toLowerCase(), // TODO: display the icon
        title: account_type.toLowerCase() === 'virtual' ? localize('DEMO') : account_type,
    };
};

const makeAccountsList = (client) => client.getAllLoginids().map(loginid => (
    loginid !== client.get('loginid') &&
    !client.get('is_disabled', loginid) &&
    client.get('token', loginid) ?
        getAccountInfo(loginid, client) :
        undefined
)).filter(account => account);

class AccountSwitcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts_list: makeAccountsList(props.client),
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };

    doSwitch(loginid, client) {
        this.props.toggle();
        client.switchAccount(loginid, this.props.client, this.props.modules);
    }

    handleClickOutside = (event) => {
        const accounts_toggle_btn = !(event.target.classList.contains('acc-info'));
        if (this.wrapper_ref && !this.wrapper_ref.contains(event.target)
            && this.props.is_visible && accounts_toggle_btn) {
            this.props.toggle();
        }
    };

    render() {
        const { client } = this.props;
        if (!client.is_logged_in) return false;

        return (
            <div className='acc-switcher-list' ref={this.setWrapperRef}>
                {(this.state.accounts_list.length > 0) &&
                this.state.accounts_list.map((account) => (
                    <React.Fragment key={account.loginid}>
                        <div
                            className={classNames('acc-switcher-account', account.icon)}
                            onClick={() => this.doSwitch(account.loginid, client)}
                        >
                            <span className='acc-switcher-id'>{account.loginid}</span>
                            <span className='acc-switcher-type'>{account.title}</span>
                        </div>
                    </React.Fragment>
                ))}
                {this.props.is_upgrade_enabled &&
                <div className='acc-button'>
                    <UpgradeButton onClick={this.props.onClickUpgrade} />
                </div>
                }
                <div className='acc-logout' onClick={requestLogout}>
                    <span className='acc-logout-text'>{localize('Log out')}</span>
                    <IconLogout className='drawer-icon' />
                </div>
            </div>
        );
    }
}

AccountSwitcher.propTypes = {
    client            : PropTypes.object,
    is_upgrade_enabled: PropTypes.bool,
    is_visible        : PropTypes.bool,
    modules           : PropTypes.object,
    onClickUpgrade    : PropTypes.func,
    toggle            : PropTypes.func,
};

const account_switcher = connect(
    ({ client, modules }) => ({
        client, modules,
    }),
)(AccountSwitcher);

export { account_switcher as AccountSwitcher };
