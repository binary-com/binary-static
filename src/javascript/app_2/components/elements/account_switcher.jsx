import classNames       from 'classnames';
import React            from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Client           from '../../../_common/base/client_base';
import GTM              from '../../../_common/base/gtm';
import SocketCache      from '../../../_common/base/socket_cache';
import { localize }     from '../../../_common/localize';

const getAccountInfo = (loginid) => {
    const currency     = Client.get('currency', loginid);
    const is_virtual   = Client.get('is_virtual', loginid);
    const account_type = !is_virtual && currency ? currency : Client.getAccountTitle(loginid);
    return {
        loginid,
        is_virtual,
        icon : account_type.toLowerCase(), // TODO: display the icon
        title: localize('[_1] Account', [account_type]),
    };
};

const makeAccountsList = () => Client.getAllLoginids().map(loginid => (
    loginid !== Client.get('loginid') &&
    !Client.get('is_disabled', loginid) &&
    Client.get('token', loginid) ?
        getAccountInfo(loginid) :
        undefined
)).filter(account => account);

class AccountSwitcher extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_collapsed  : false,
            active_account: getAccountInfo(Client.get('loginid')),
            accounts_list : makeAccountsList(),
        };
    }

    toggleAccountsList = () => {
        if (this.state.accounts_list) {
            this.setState({
                is_collapsed: !this.state.is_collapsed,
            });
        }
    };

    switchAccount = (loginid) => {
        if (!loginid || !Client.get('token', loginid)) {
            return;
        }

        sessionStorage.setItem('active_tab', '1');
        // set local storage
        GTM.setLoginFlag();
        Client.set('cashier_confirmed', 0);
        Client.set('accepted_bch', 0);
        Client.set('loginid', loginid);
        SocketCache.clear();
        window.location.reload();
    };

    render() {
        if (!Client.isLoggedIn()) return false;

        const account_list_collapsed = {
            visibility: `${this.state.is_collapsed ? 'visible' : 'hidden'}`,
        };

        const switcher_active_login_class = classNames('acc-switcher-active-login', this.state.active_account.icon, {
            'collapsed': this.state.is_collapsed,
        });

        const switcher_list_class = classNames('acc-switcher-list', {
            'collapsed': this.state.is_collapsed,
        });

        return (
            <div className='acc-switcher-container'>
                <div className='acc-switcher-header' onClick={this.toggleAccountsList}>
                    <div className={switcher_active_login_class}>
                        <p className='acc-switcher-accountid'>{this.state.active_account.loginid}</p>
                        <p className='acc-switcher-currency'>{this.state.active_account.title}</p>
                    </div>
                </div>
                <div
                    className={switcher_list_class}
                    style={account_list_collapsed}
                >
                    <PerfectScrollbar>
                        <div className='acc-switcher-items'>
                            {this.state.accounts_list.map((account) => (
                                <React.Fragment key={account.loginid}>
                                    <div
                                        className={classNames('acc-switcher-account', account.icon)}
                                        onClick={this.switchAccount.bind(null, account.loginid)}
                                    >
                                        <p className='acc-switcher-accountid'>{account.loginid}</p>
                                        <p className='acc-switcher-currency'>{account.title}</p>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </PerfectScrollbar>
                </div>
            </div>
        );
    }
}

export default AccountSwitcher;
