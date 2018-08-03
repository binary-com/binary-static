import React             from 'react';
import { DrawerItem }    from './Drawer';
// import ToggleButton      from '../Elements/toggle_button.jsx';
import { IconLogout }    from '../../../Assets/Header/Drawer';
import { requestLogout } from '../../../Services';
import Client            from '../../../../_common/base/client_base';
import { localize }      from '../../../../_common/localize';

export const MenuDrawer = () => {
    const is_desktop = window.innerWidth > 979;
    return (
        <div className='drawer-items-container'>
            <div className='list-items-container'>
                {/* Hide menu items until pages are ready
                <DrawerItem text={localize('Manage Password')} />
                <DrawerItem text={localize('Useful Resources')}/>
                <DrawerItem text={localize('Login History')}/>
                <hr />
                <DrawerItem text={localize('Settings')} link_to='/settings' />
                */}
                {!is_desktop &&
                <React.Fragment>
                    <DrawerItem text={localize('Purchase Confirmation')} />
                    <DrawerItem text={localize('Purchase Lock')} />
                    <DrawerItem text={localize('Dark Theme')} />
                </React.Fragment>}
                {/* Same as above
                <hr />
                <DrawerItem text={localize('Contact Us')}/>
                */}
            </div>
            <div className='drawer-footer'>
                {Client.isLoggedIn() &&
                    <DrawerItem
                        icon={<IconLogout className='drawer-icon'/>}
                        text={localize('Logout')}
                        custom_action={requestLogout}
                    />
                }
            </div>
        </div>
    );
};
