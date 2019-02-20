import React        from 'react';
import { localize } from '_common/localize';
import { IconBell } from 'Assets/Header/NavBar';

const EmptyNotification = () => (
    <div className='no-notifications-container'>
        <div className='notification-message'>
            <div className='bell-icon'>
                <IconBell />
            </div>
            <div>
                <h4>{localize('No Notifications')}</h4>
                <span className='no-notifications-message'>{localize('You have yet to receive any notifications')}</span>
            </div>
        </div>
    </div>
);

export { EmptyNotification };
