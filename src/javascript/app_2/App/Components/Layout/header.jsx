import PropTypes           from 'prop-types';
import React               from 'react';
import { AccountBalance }  from '../Elements/account_balance.jsx';
import AccountSwitcher     from '../Elements/account_switcher.jsx';
import {
    ToggleDrawer,
    DrawerItem }           from '../Elements/Drawer/index.jsx';
import { MenuDrawer }      from '../Elements/menu_drawer.jsx';
import { BinaryLink }      from '../../routes';
import Url                 from '../../../../_common/url';

class Header extends React.Component {
    render() {
        const { items } = this.props;

        return (
            <React.Fragment>
                <header className='shadow'>
                    <div className='menu-items'>
                        <div className='menu-left'>
                            <ToggleDrawer alignment='left'>
                                <AccountSwitcher />
                                <MenuDrawer />
                            </ToggleDrawer>
                            <div className='navbar-icons binary-logo'>
                                <img className='logo-img' src={Url.urlForStatic('images/app_2/header/symbol.svg')} alt='Binary.com' />
                            </div>
                            {!!items.length &&
                                <div className='menu-links'>
                                    {items.map((item, idx) => (
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
                            icon_link={Url.urlForStatic('images/app_2/header/icons/ic_notification_light.svg')}
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

Header.propTypes = {
    items: PropTypes.array,
};

export default Header;
