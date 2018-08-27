import React             from 'react';
import { Notifications } from '../../Elements/Notifications';
import { ToggleDrawer }  from '../../Elements/Drawer';
import { IconBell }      from '../../../../Assets/Header/NavBar';

const ToggleNotificationsDrawer = () => (
    <ToggleDrawer
        alignment='right'
        icon={<IconBell/>}
        icon_class='notify-toggle'
    >
        <Notifications />
    </ToggleDrawer>
);

export { ToggleNotificationsDrawer };
