import React             from 'react';
import { IconHamburger } from 'Assets/Header/NavBar';
import { ToggleDrawer }  from '../../Elements/Drawer';
import MenuDrawer        from '../../../Containers/Drawer/menu_drawer.jsx';

const ToggleMenuDrawer = () => (
    <ToggleDrawer
        alignment='left'
        icon={<IconHamburger />}
        icon_class='menu-toggle'
    >
        <MenuDrawer />
    </ToggleDrawer>
);

export { ToggleMenuDrawer };
