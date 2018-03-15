import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classNames from 'classnames';
import { localize } from '../../../../../_common/localize';

class AccountSwitcher extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_collapsed  : false,
            active_account: this.props.active_account[0],
        };
    }

    toggleAccountsList = () => {
        this.setState({
            is_collapsed: !this.state.is_collapsed,
        });
    };

    switchAccount = (account) => {
        this.setState({
            active_account: account,
        });
        if (account.id !== this.state.active_account.id) {
            if (this.props.onChange) {
                this.props.onChange({ target: { name: 'currency', value: account.account_type } });
            }
        }
    };

    render() {
        const account_list_collapsed = {
            visibility: `${this.state.is_collapsed ? 'visible' : 'hidden'}`,
        };

        const isAccountHidden = (account) => (account.id === this.state.active_account.id);
        const getSwitcherAccountClass = (account) => classNames('acc-switcher-account', {
            'hide': isAccountHidden(account),
        });

        const switcher_active_login_class = classNames('acc-switcher-active-login', {
            'collapsed': this.state.is_collapsed,
        });
        const switcher_list_class = classNames('acc-switcher-list', {
            'collapsed': this.state.is_collapsed,
        });

        return (
            <div className='acc-switcher-container'>
                <div className='acc-switcher-header' onClick={this.toggleAccountsList}>
                    <div className={switcher_active_login_class}>
                        <p className='acc-switcher-accountid'>{this.state.active_account.id}</p>
                        <p className='acc-switcher-currency'>{`${this.state.active_account.account_type} ${localize('Account')}`}</p>
                    </div>
                </div>
                <div
                    className={switcher_list_class}
                    style={account_list_collapsed}
                >
                    <PerfectScrollbar>
                        <div className='acc-switcher-items'>
                            {this.props.accounts.map((account, idx) => (
                                <React.Fragment key={idx}>
                                    <div
                                        className={getSwitcherAccountClass(account)}
                                        onClick={this.switchAccount.bind(null, account)}
                                    >
                                        <p className='acc-switcher-accountid'>{account.id}</p>
                                        <p className='acc-switcher-currency'>{`${account.account_type} ${localize('Account')}`}</p>
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


// TODO: Remove defaultProps and parse accounts from websockets/localstorage
AccountSwitcher.defaultProps = {
    accounts: [
      { id: 'VRTC1234567', account_type: 'Virtual' },
      { id: 'CR198765',    account_type: 'USD' },
      { id: 'CR986754',    account_type: 'BTC' },
      { id: 'CR985761',    account_type: 'ETH' },
      { id: 'CR247698',    account_type: 'LTC' },
      { id: 'CR579857',    account_type: 'BCH' },
    ],
};

export default AccountSwitcher;
