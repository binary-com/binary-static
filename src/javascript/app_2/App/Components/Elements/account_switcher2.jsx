import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import Client            from '../../../../_common/base/client_base';
import GTM               from '../../../../_common/base/gtm';
import SocketCache       from '../../../../_common/base/socket_cache';
import { localize }      from '../../../../_common/localize';

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

class AccountSwitcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts_list: makeAccountsList(),
        };
    }

    switchAccount = (loginid) => {
        if (!loginid || !Client.get('token', loginid)) {
            return;
        }
        console.log('switching');
        sessionStorage.setItem('active_tab', '1');
        // set local storage
        this.props.toggle();
        GTM.setLoginFlag();
        Client.set('cashier_confirmed', 0);
        Client.set('accepted_bch', 0);
        Client.set('loginid', loginid);
        SocketCache.clear();
        window.location.reload();
    };

    render() {
        if (!Client.isLoggedIn() || !(this.state.accounts_list.length > 0)) return false;

        return (
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
        );
    }
}

AccountSwitcher.propTypes = {
    toggle: PropTypes.func,
};

export default AccountSwitcher;
