import React from 'react';
import { ToggleDrawer, DrawerItems, DrawerItem } from './drawer.jsx';
import AccountSwitcher from './account_switcher.jsx';
import LanguageSwitcher from './language_switcher.jsx';
import Button from '../form/button.jsx';
import Url from '../../../../../_common/url';
import { localize } from '../../../../../_common/localize';

class TradingHeader extends React.Component {
    render() {
        const menu_link_is_active = (name) => {
            const pathname = window.location.pathname;
            if (pathname.indexOf(name.toLowerCase()) >= 0) {
                return true;
            }
            return false;
        };
        return (
            <React.Fragment>
                <header id={this.props.id} className='shadow'>
                    <div className='menu-items'>
                        <div className='menu-left'>
                            <ToggleDrawer alignment='left'>
                                <AccountSwitcher
                                    active_account={[
                                        { id: 'VRTC1234567', account_type: 'Virtual' },
                                    ]}
                                />
                                <div className='drawer-items-container'>
                                    <DrawerItems
                                        text='Account Settings'
                                        items={[
                                            { text: 'Personal Detail' },
                                            { text: 'Account Authentication' },
                                            { text: 'Financial Assessment' },
                                            { text: 'Professional Trader' },
                                        ]}
                                    />
                                    <DrawerItems
                                        text='Security Settings'
                                        items={[
                                            { text: 'Self Exclusion' },
                                            { text: 'Trading Limits' },
                                            { text: 'Authorised Applications' },
                                            { text: 'API Token' },
                                        ]}
                                    />
                                    <DrawerItems
                                        text='Trading History'
                                        items={[
                                            { text: 'Portfolio' },
                                            { text: 'Profit Table' },
                                            { text: 'Statement' },
                                        ]}
                                    />
                                    <DrawerItem text='Cashier'/>
                                    <hr />
                                    <DrawerItem text='Manage Password'/>
                                    <DrawerItem text='Useful Resources'/>
                                    <DrawerItem text='Login History'/>
                                    <hr />
                                    <LanguageSwitcher />
                                </div>
                            </ToggleDrawer>
                            <div className='navbar-icons binary-logo'>
                                <img className='logo-img' src={Url.urlForStatic('images/trading_app/symbol.svg')} alt='Binary.com' />
                            </div>
                            {!!this.props.items.length &&
                                <div className='menu-links'>
                                    {this.props.items.map((item, idx) => (
                                        <a
                                            className={`${menu_link_is_active(item.text) ? 'active': ''}`}
                                            key={idx}
                                            href={item.href || 'javascript:;'} >
                                            <span className={item.icon}>{item.text}</span>
                                        </a>
                                    ))}
                                </div>
                            }
                        </div>
                        <div className='menu-right'>
                            <AccountBalance
                                active_loginid={this.props.active_loginid}
                                client_accounts={this.props.client_accounts}
                            />
                        </div>
                        <ToggleDrawer
                            icon_class='notify-toggle'
                            alignment='right'
                            icon_link={Url.urlForStatic('images/trading_app/notify_none.svg')}
                        >
                            <DrawerItem text='Alert 1'/>
                            <DrawerItem text='Alert 2'/>
                            <DrawerItem text='Alert 3'/>
                        </ToggleDrawer>
                    </div>
                </header>
          </React.Fragment>
        );
    }
}

const AccountBalance = ({
    active_loginid,
    client_accounts,
    onClick,
}) => {
    const balance = client_accounts[Object.keys(client_accounts)[0]].balance;
    const is_upgrade = client_accounts[Object.keys(client_accounts)[0]].is_virtual;
    const currency = client_accounts[Object.keys(client_accounts)[0]].currency;
    const button_text = is_upgrade === 1 ? 'Upgrade' : 'Deposit';
    return (
        <div className='acc-balance-container'>
            <div className='acc-balance'>
                <p className='acc-balance-accountid'>{active_loginid || null}</p>
                <p className='acc-balance-amount'><i><span className={`symbols ${currency.toLowerCase()}`} /></i>{balance || null}</p>
            </div>
            <Button
                id='acc-balance-btn'
                className='primary orange'
                has_effect
                text={`${localize(button_text)}`}
                onClick={onClick}
            />
        </div>
    );
};

TradingHeader.defaultProps = {
    active_loginid : 'VRTC1234567',
    client_accounts: {'VRTC1234567': {'currency': 'AUD','is_disabled': 0,'is_virtual': 1,'balance': '10000.00'}},
};

export default TradingHeader;
