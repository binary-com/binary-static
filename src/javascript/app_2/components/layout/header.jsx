import React               from 'react';
import PerfectScrollbar    from 'react-perfect-scrollbar';
import AccountSwitcher     from '../elements/account_switcher.jsx';
import {
    DrawerItem,
    DrawerItems,
    ToggleDrawer }         from '../elements/drawer.jsx';
import LanguageSwitcher    from '../elements/language_switcher.jsx';
import Button              from '../form/button.jsx';
import { requestLogout }   from '../../base/common';
import { BinaryLink }      from '../../routes';
import { connect }         from '../../store/connect';
import Client              from '../../../_common/base/client_base';
import { formatMoney }     from '../../../_common/base/currency_base';
import { redirectToLogin } from '../../../_common/base/login';
import { localize }        from '../../../_common/localize';
import Url                 from '../../../_common/url';

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

const DrawerFooter = () => ( // TODO: update the UI
    <a href='javascript:;' onClick={requestLogout}>{localize('Log out')}</a>
);

class Header extends React.Component {
    render() {
        return (
            <React.Fragment>
                <header id={this.props.id} className='shadow'>
                    <div className='menu-items'>
                        <div className='menu-left'>
                            <ToggleDrawer alignment='left' footer={DrawerFooter}>
                                <AccountSwitcher />
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
                            <AccountBalance />
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

const AccountBalance = connect(
    ({ client }) => ({
        balance: client.balance,
    })
)(({
    balance,
}) => {
    const loginid      = Client.get('loginid');
    const currency     = Client.get('currency');
    const upgrade_info = Client.getBasicUpgradeInfo();
    const can_upgrade  = upgrade_info.can_upgrade || upgrade_info.can_open_multi;

    return (
        <div className='acc-balance-container'>
            {Client.isLoggedIn() ?
                <React.Fragment>
                    <div className='acc-balance'>
                        <p className='acc-balance-accountid'>{loginid}</p>
                        {typeof balance !== 'undefined' &&
                            <p className='acc-balance-amount'>
                                <i><span className={`symbols ${(currency || '').toLowerCase()}`}/></i>
                                {formatMoney(currency, balance, true)}
                            </p>
                        }
                    </div>
                    {can_upgrade &&
                        <Button
                            id='acc-balance-btn'
                            className='primary orange'
                            has_effect
                            text={localize('Upgrade')}
                            // onClick={onClickUpgrade} TODO
                        />
                    }
                </React.Fragment> :
                <Button
                    className='primary green'
                    has_effect
                    text={localize('Login')}
                    handleClick={redirectToLogin}
                />
            }
        </div>
    );
});

export default Header;
