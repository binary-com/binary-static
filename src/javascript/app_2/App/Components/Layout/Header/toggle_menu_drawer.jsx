import React             from 'react';
import AccountSwitcher   from '../../Elements/account_switcher.jsx';
import { ToggleDrawer }  from '../../Elements/Drawer';
import { MenuDrawer }    from '../../Elements/menu_drawer.jsx';

const ToggleMenuDrawer = () => (
    <ToggleDrawer alignment='left'>
        <AccountSwitcher />
        <MenuDrawer />
    </ToggleDrawer>
);

export { ToggleMenuDrawer };