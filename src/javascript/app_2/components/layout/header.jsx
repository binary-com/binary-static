import React               from 'react';
import PropTypes           from 'prop-types';
import AccountSwitcher     from '../elements/account_switcher.jsx';
import {
    ToggleDrawer,
    DrawerItem }           from '../elements/drawer/index.jsx';
import { requestLogout }   from '../../base/common';
import { BinaryLink }      from '../elements/binary_link.jsx';
import { localize }        from '../../../_common/localize';
import Url                 from '../../../_common/url';
import { AccountBalance }  from './account_balance.jsx';
import { MenuDrawer }      from './menu_drawer.jsx';

const DrawerFooter = () => ( // TODO: update the UI
    <a href='javascript:;' onClick={requestLogout}>{localize('Log out')}</a>
);

class Header extends React.Component {
    render() {
        const { items } = this.props;

        return (
            <React.Fragment>
                <header className='shadow'>
                    <div className='menu-items'>
                        <div className='menu-left'>
                            <ToggleDrawer alignment='left' footer={DrawerFooter}>
                                <AccountSwitcher />
                                <MenuDrawer />
                            </ToggleDrawer>
                            <div className='navbar-icons binary-logo'>
                                <img className='logo-img' src={Url.urlForStatic('images/trading_app/header/symbol.svg')} alt='Binary.com' />
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

Header.propTypes = {
    items: PropTypes.array,
};

export default Header;
