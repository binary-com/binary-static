import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { localize } from '../../../_common/localize';
import { DrawerItem } from '../elements/drawer/index.jsx';
import { requestLogout } from '../../base/common';
import Client from '../../../_common/base/client_base';

export const MenuDrawer = () => {
    const is_desktop = window.innerWidth > 979;
    return (
        <div className='drawer-items-container'>
            <PerfectScrollbar>
                <div className='list-items-container'>
                    <DrawerItem text={localize('Manage Password')} />
                    <DrawerItem text={localize('Useful Resources')}/>
                    <DrawerItem text={localize('Login History')}/>
                    <hr />
                    <DrawerItem text={localize('Settings')} link_to='/settings' />
                    {!is_desktop &&
                    <React.Fragment>
                        <DrawerItem text={localize('Purchase Confirmation')} />
                        <DrawerItem text={localize('Purchase Lock')} />
                        <DrawerItem text={localize('Dark Theme')} />
                    </React.Fragment>
                    }
                    <hr />
                    <DrawerItem text={localize('Contact Us')}/>
                    {Client.isLoggedIn() &&
                        <DrawerItem text={localize('Logout')} custom_action={requestLogout}/>
                    }
                </div>
            </PerfectScrollbar>
        </div>
    );
};
