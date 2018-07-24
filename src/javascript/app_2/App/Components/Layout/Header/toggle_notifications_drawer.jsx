import React             from 'react';
import { Notifications } from '../../Elements/Notifications';
import { ToggleDrawer }  from '../../Elements/Drawer';
import Url               from '../../../../../_common/url';

const ToggleNotificationsDrawer = () => (
    <ToggleDrawer
        icon_class='notify-toggle'
        alignment='right'
        icon_link={Url.urlForStatic('images/app_2/header/icons/ic_notification_light.svg')}
    >
        <Notifications />
    </ToggleDrawer>
);

export { ToggleNotificationsDrawer };