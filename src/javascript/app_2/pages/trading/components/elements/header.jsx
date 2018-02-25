import React from 'react';
import { ToggleDrawer, DrawerItems, DrawerItem } from './drawer.jsx';
import AccountSwitcher from './account_switcher.jsx';
import Url from '../../../../../_common/url';

class TradingHeader extends React.Component {
    render() {
        return (
            <React.Fragment>
                <header id={this.props.id} className='shadow'>
                    <div className='menu-items'>
                        <div className='menu-left'>
                            <ToggleDrawer alignment='left'>
                                <AccountSwitcher active_account={[
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
                                </div>
                            </ToggleDrawer>
                            <div className='navbar-icons binary-logo'>
                                <img className='logo-img' src={Url.urlForStatic('images/trading_app/symbol.svg')} alt='Binary.com' />
                            </div>
                            {!!this.props.items.length &&
                                <div className='menu-links'>
                                    {this.props.items.map((item, idx) => (
                                        <a key={idx} href={item.href || 'javascript:;'} >
                                            <span className={item.icon}>{item.text}</span>
                                        </a>
                                    ))}
                                </div>
                            }
                        </div>
                        <ToggleDrawer 
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

export default TradingHeader;
