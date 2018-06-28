import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { localize } from '../../../_common/localize';
import { DrawerItems, DrawerItem } from '../elements/drawer/index.jsx';
import { requestLogout } from '../../base/common';
import Client from '../../../_common/base/client_base';

export const MenuDrawer = () => (
    <div className='drawer-items-container'>
        <PerfectScrollbar>
            <div className='list-items-container'>
                <DrawerItem text={localize('Manage Password')} />
                <DrawerItem text={localize('Useful Resources')}/>
                <DrawerItem text={localize('Login History')}/>
                <hr />
                <DrawerItems
                    text={localize('Settings')}
                    items={[
                        { text: localize('Personal Detail'), link_to: '/settings/personal' },
                        { text: localize('Account Authentication') },
                        { text: localize('Financial Assessment'), link_to: '/settings/financial' },
                        { text: localize('Professional Trader') },
                    ]}
                />
                <DrawerItems
                    text={localize('Security Settings')}
                    items={[
                        { text: localize('Self Exclusion'), link_to: '/settings/exclusion' },
                        { text: localize('Trading Limits') },
                        { text: localize('Authorised Applications'), link_to: '/settings/apps'},
                        { text: localize('API Token'), link_to: '/settings'},
                    ]}
                />
                <DrawerItem text={localize('Purchase Confirmation')} />
                <DrawerItem text={localize('Purchase Lock')} />
                <DrawerItem text={localize('Dark Theme')} />
                <hr />
                <DrawerItem text={localize('Contact Us')}/>
                {Client.isLoggedIn() &&
                    <DrawerItem text={localize('Logout')} custom_action={requestLogout}/>
                }
            </div>
        </PerfectScrollbar>
    </div>
);
