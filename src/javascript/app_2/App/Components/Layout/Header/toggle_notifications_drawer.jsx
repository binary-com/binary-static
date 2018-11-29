import React             from 'react';
import { IconBell }      from 'Assets/Header/NavBar';
import { ToggleDrawer }  from '../../Elements/Drawer';
import { Notifications } from '../../Elements/Notifications';

const ToggleNotificationsDrawer = () => (
    <ToggleDrawer
        alignment='right'
        icon={<IconBell />}
        icon_class='notify-toggle'
    >
        <Notifications />
    </ToggleDrawer>
);

export { ToggleNotificationsDrawer };
