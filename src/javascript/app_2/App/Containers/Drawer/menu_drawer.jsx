import React             from 'react';
import PropTypes         from 'prop-types';
import { DrawerItem,
         DrawerToggle }  from '../../Components/Elements/Drawer';
import { IconLogout }    from '../../../Assets/Header/Drawer';
import { IconTrade,
         IconPortfolio,
         IconStatement } from '../../../Assets/Header/NavBar';
import { requestLogout } from '../../../Services';
import Client            from '../../../../_common/base/client_base';
import { localize }      from '../../../../_common/localize';
import { connect }       from '../../../Stores/connect';

const MenuDrawer = ({
    is_dark_mode,
    is_mobile,
    is_purchase_confirmed,
    is_purchase_locked,
    toggleDarkMode,
    togglePurchaseLock,
    togglePurchaseConfirmation,
}) => (
    <div className='drawer-items-container'>
        <div className='list-items-container'>
            {/* Hide menu items until pages are ready
            <DrawerItem text={localize('Manage Password')} />
            <DrawerItem text={localize('Useful Resources')}/>
            <DrawerItem text={localize('Login History')}/>
            <hr />
            <DrawerItem text={localize('Settings')} link_to='/settings' />
            */}
            {is_mobile &&
            <React.Fragment>
                <DrawerItem
                    text={localize('Trade')}
                    icon={<IconTrade className='drawer-icon' />}
                    link_to='/trade'
                />
                <DrawerItem
                    text={localize('Portfolio')}
                    icon={<IconPortfolio className='drawer-icon' />}
                    link_to='/portfolio'
                />
                <DrawerItem
                    text={localize('Statement')}
                    icon={<IconStatement className='drawer-icon' />}
                    link_to='/statement'
                />
                <hr />
                <DrawerToggle
                    text={localize('Purchase Confirmation')}
                    toggle={togglePurchaseConfirmation}
                    to_toggle={is_purchase_confirmed}
                />
                <DrawerToggle
                    text={localize('Purchase Lock')}
                    toggle={togglePurchaseLock}
                    to_toggle={is_purchase_locked}
                />
                <DrawerToggle
                    text={localize('Dark Theme')}
                    toggle={toggleDarkMode}
                    to_toggle={is_dark_mode}
                />
            </React.Fragment>}
            {/* Same as above
            <hr />
            <DrawerItem text={localize('Contact Us')}/>
            */}
        </div>
        {Client.isLoggedIn() &&
            <div className='drawer-footer'>
                <DrawerItem
                    icon={<IconLogout className='drawer-icon'/>}
                    text={localize('Logout')}
                    custom_action={requestLogout}
                />
            </div>
        }
    </div>
);

MenuDrawer.propTypes = {
    is_dark_mode              : PropTypes.bool,
    is_purchase_confirmed     : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    toggleDarkMode            : PropTypes.func,
    togglePurchaseConfirmation: PropTypes.func,
    togglePurchaseLock        : PropTypes.func,
    is_mobile                 : PropTypes.bool,
};

const menu_drawer_component = connect(({ ui }) => ({
    is_dark_mode              : ui.is_dark_mode_on,
    is_purchase_confirmed     : ui.is_purchase_confirm_on,
    is_purchase_locked        : ui.is_purchase_lock_on,
    toggleDarkMode            : ui.toggleDarkMode,
    togglePurchaseConfirmation: ui.togglePurchaseConfirmation,
    togglePurchaseLock        : ui.togglePurchaseLock,
    is_mobile                 : ui.is_mobile,
}))(MenuDrawer);

export { menu_drawer_component as MenuDrawer };
