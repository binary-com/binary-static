import PropTypes           from 'prop-types';
import React               from 'react';
import { DrawerItem }      from '../../Elements/Drawer/index.jsx';
import Url                 from '../../../../../_common/url';

const Notifications = ({ list }) => (
    <React.Fragment>
        {
            list && list.length ?
            list.map((item, idx) => (
                <React.Fragment key={idx}>
                    <DrawerItem text={item[idx]} />
                </React.Fragment>
            ))
          :
            <div className='no-notifications-container'>
                <div>
                    <img src={Url.urlForStatic('images/app_2/header/icons/ic_notification_light.svg')} />
                </div>
                <div>
                    <h4>No Notifications</h4>
                    <span className='no-notifications_message'>You have yet to receive any notifications</span>
                </div>
            </div>
        }

    </React.Fragment>
);

Notifications.propTypes = {
    'list': PropTypes.object,
};

export { Notifications };
