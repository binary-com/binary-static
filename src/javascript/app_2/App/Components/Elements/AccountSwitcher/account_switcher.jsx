import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { localize }      from '_common/localize';
import { IconLogout }    from 'Assets/Header/Drawer';
import { requestLogout } from 'Services';
import { connect }       from 'Stores/connect';
import { UpgradeButton } from './upgrade_button.jsx';

const makeAccountsList = ({ client }) => client.all_loginids.map(id => (
    id !== client.loginid &&
    !client.isDisabled(id) &&
    client.getToken(id) ?
        client.getAccountInfo(id) :
        undefined
)).filter(account => account);

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

    constructor(props) {
        super(props);
        this.state = {
            accounts_list: makeAccountsList(props),
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    async doSwitch(loginid) {
        this.props.toggle();
        await this.props.client.switchAccount(loginid);
    }

    render() {
        if (!this.props.client.is_logged_in) return false;

        return (
            <div className='acc-switcher-list' ref={this.setWrapperRef}>
                {(this.state.accounts_list.length > 0) &&
                this.state.accounts_list.map((account) => (
                    <React.Fragment key={account.loginid}>
                        <div
                            className={classNames('acc-switcher-account', account.icon)}
                            onClick={this.doSwitch.bind(this, account.loginid)}
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
    onClickUpgrade    : PropTypes.func,
    toggle            : PropTypes.func,
};

const account_switcher = connect(
    ({ client }) => ({
        client,
    }),
)(AccountSwitcher);

export { account_switcher as AccountSwitcher };
