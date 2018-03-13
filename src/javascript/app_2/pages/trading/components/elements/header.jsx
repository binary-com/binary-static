import React from 'react';
import { ToggleDrawer, MenuDrawer, DrawerItem } from './drawer.jsx';
import AccountSwitcher from './account_switcher.jsx';
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
                                    has_iscroll
                                />
                                <div className='drawer-items-container'>
                                    <MenuDrawer />
                                </div>
                            </ToggleDrawer>
                            <div className='navbar-icons binary-logo'>
                                <img className='logo-img' src={Url.urlForStatic('images/trading_app/header/symbol.svg')} alt='Binary.com' />
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
                            icon_link={Url.urlForStatic('images/trading_app/header/notification/ic-notification-light.svg')}
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
    let currency = client_accounts[Object.keys(client_accounts)[0]].currency;
    currency = currency ? currency.toLowerCase() : null;
    const button_text = is_upgrade === 1 ? 'Upgrade' : 'Deposit';
    return (
        <div className='acc-balance-container'>
            <div className='acc-balance'>
                <p className='acc-balance-accountid'>{active_loginid || null}</p>
                <p className='acc-balance-amount'>
                    <i><span className={`symbols ${currency}`} /></i>
                    {balance || null}
                </p>
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

// TO-DO: Remove defaultProps
TradingHeader.defaultProps = {
    active_loginid : localStorage.getItem('active_loginid') || 'VRTC1234567',
    client_accounts: JSON.parse(localStorage.getItem('client.accounts')) || {'VRTC1234567': {'currency': 'AUD','is_disabled': 0,'is_virtual': 1,'balance': '10000.00'}},
};

export default TradingHeader;
