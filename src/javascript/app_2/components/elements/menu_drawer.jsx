import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { localize } from '../../../_common/localize';
import { DrawerItems, DrawerItem } from '../elements/drawer/index.jsx';
import { requestLogout } from '../../base/common';
import Client from '../../../_common/base/client_base';

export const MenuDrawer = () => {
    const is_desktop = window.innerWidth > 979;
    return (
        <div className='drawer-items-container'>
            <PerfectScrollbar>
                <div className='list-items-container'>
                    <DrawerItem text={localize('Manage Password')}/>
                    <DrawerItem text={localize('Useful Resources')}/>
                    <DrawerItem text={localize('Login History')}/>
                    <hr />
                    <DrawerItems
                        text={localize('Settings')}
                        items={[
                            { text: localize('Personal Detail') },
                            { text: localize('Account Authentication') },
                            { text: localize('Financial Assessment') },
                            { text: localize('Professional Trader') },
                            { text: localize('Self Exclusion') },
                            { text: localize('Trading Limits') },
                            { text: localize('Authorised Applications') },
                            { text: localize('API Token') },
                        ]}
                    />
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
