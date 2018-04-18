import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ToggleDrawer, DrawerItems, DrawerItem } from '../elements/drawer.jsx';
import LanguageSwitcher from '../elements/language_switcher.jsx';
import AccountSwitcher from '../elements/account_switcher.jsx';
import Button from '../form/button.jsx';
import { localize } from '../../../_common/localize';
import Url from '../../../_common/url';
import { BinaryLink } from '../../routes';

const MenuDrawer = () => (
    <div className='drawer-items-container'>
        <PerfectScrollbar>
            <div className='list-items-container'>
                <DrawerItems
                    text={localize('Account Settings')}
                    items={[
                        { text: localize('Personal Detail') },
                        { text: localize('Account Authentication') },
                        { text: localize('Financial Assessment') },
                        { text: localize('Professional Trader') },
                    ]}
                />
                <DrawerItems
                    text={localize('Security Settings')}
                    items={[
                        { text: localize('Self Exclusion') },
                        { text: localize('Trading Limits') },
                        { text: localize('Authorised Applications') },
                        { text: localize('API Token') },
                    ]}
                />
                <DrawerItems
                    text={localize('Trading History')}
                    items={[
                        { text: localize('Portfolio') },
                        { text: localize('Profit Table') },
                        { text: localize('Statement'), link_to: 'statement' },
                    ]}
                />
                <DrawerItem text={localize('Cashier')} />
                <hr />
                <DrawerItem text={localize('Manage Password')} />
                <DrawerItem text={localize('Useful Resources')}/>
                <DrawerItem text={localize('Login History')}/>
                <hr />
                <LanguageSwitcher />
            </div>
        </PerfectScrollbar>
    </div>
);

class TradingHeader extends React.Component {
    render() {
        return (
            <React.Fragment>
                <header id={this.props.id} className='shadow'>
                    <div className='menu-items'>
                        <div className='menu-left'>
                            <ToggleDrawer alignment='left' has_footer>
                                <AccountSwitcher
                                    active_account={[ // TODO: remove dummy values
                                        { id: 'VRTC1234567', account_type: 'Virtual' },
                                    ]}
                                />
                                <MenuDrawer />
                            </ToggleDrawer>
                            <div className='navbar-icons binary-logo'>
                                <img className='logo-img' src={Url.urlForStatic('images/trading_app/header/symbol.svg')} alt='Binary.com' />
                            </div>
                            {!!this.props.items.length &&
                                <div className='menu-links'>
                                    {this.props.items.map((item, idx) => (
                                        <BinaryLink key={idx} to={item.link_to}>
                                            <span className={item.icon} title={item.text}>{item.text}</span>
                                        </BinaryLink>
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
                            icon_link={Url.urlForStatic('images/trading_app/header/icons/ic_notification_light.svg')}
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
    // TODO: Use Client.get()
    const account     = client_accounts[Object.keys(client_accounts)[0]];
    const button_text = account.is_virtual ? 'Upgrade' : 'Deposit';
    const balance     = account.balance;
    let currency      = account.currency;
    currency = currency ? currency.toLowerCase() : null;

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

// TODO: Remove defaultProps dummy values and use Client.get()
TradingHeader.defaultProps = {
    active_loginid : 'VRTC1234567',
    client_accounts: {'VRTC1234567': {'currency': 'AUD','is_disabled': 0,'is_virtual': 1,'balance': '10000.00'}},
};

export default TradingHeader;
