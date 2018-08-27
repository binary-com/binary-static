import React             from 'react';
import AccountSwitcher   from '../../Elements/account_switcher.jsx';
import { ToggleDrawer }  from '../../Elements/Drawer';
import MenuDrawer        from '../../../Containers/Drawer/menu_drawer.jsx';
import { IconHamburger } from '../../../../Assets/Header/NavBar';

const ToggleMenuDrawer = () => (
    <ToggleDrawer
        alignment='left'
        icon={<IconHamburger/>}
        icon_class='menu-toggle'
    >
        <AccountSwitcher />
        <MenuDrawer />
    </ToggleDrawer>
);

export { ToggleMenuDrawer };
