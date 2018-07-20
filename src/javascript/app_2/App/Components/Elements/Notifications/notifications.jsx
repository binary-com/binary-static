import PropTypes           from 'prop-types';
import React               from 'react';
import { DrawerItem }      from '../../Elements/Drawer';
import Url                 from '../../../../../_common/url';
import { localize }        from '../../../../../_common/localize';

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
                <div className='notification-message'>
                    <div>
                        <img src={Url.urlForStatic('images/app_2/header/icons/ic_notification_light.svg')} />
                    </div>
                    <div>
                        <h4>{localize('No Notifications')}</h4>
                        <span className='no-notifications-message'>{localize('You have yet to receive any notifications')}</span>
                    </div>
                </div>
            </div>
        }

    </React.Fragment>
);

Notifications.propTypes = {
    'list': PropTypes.object,
};

export { Notifications };
