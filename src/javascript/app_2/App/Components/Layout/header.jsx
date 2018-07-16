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
                            {placeholder_alerts_list.length ?
                                <Notifications list={placeholder_alerts_list} />
                              :
                                <NoNotifications />
                            }
                        </ToggleDrawer>
                    </div>
                </header>
            </React.Fragment>
        );
    }
}

const placeholder_alerts_list = {
    'alert1': 'message',
    'alert2': 'message',
    'alert3': 'message',
    'alart4': 'message',
};

const Notifications = ({ list }) => (
    list.map((item, idx) => (
        <React.Fragment key={idx}>
            <DrawerItem text={item[idx]} />
        </React.Fragment>
    ))
);

const NoNotifications = () => (
    <div className='no-notifications-container'>
        <div>
            <img src={Url.urlForStatic('images/app_2/header/icons/ic_notification_light.svg')} />
        </div>
        <div>
            <h4>No Notifications</h4>
            <span className='no-notifications_message'>You have yet to receive any notifications</span>
        </div>
    </div>
);

Notifications.propTypes = {
    'list': PropTypes.object,
};

Header.propTypes = {
    items: PropTypes.array,
};

export default Header;
