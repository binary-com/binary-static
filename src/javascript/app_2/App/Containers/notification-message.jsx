import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from 'Stores/connect';
import Notification  from '../Components/Elements/NotificationMessage';

const NotificationMessage = ({
    notifications,
    removeNotification,
}) => {
    const MAX_DISPLAY_NOTIFICATIONS = 3;

    return (
        <div className='notification-messages'>
            {
                notifications.slice(0, MAX_DISPLAY_NOTIFICATIONS).map((notification, idx) => (
                    <Notification
                        key={idx}
                        data={notification}
                        removeNotification={removeNotification}
                    />
                ))
            }
        </div>
    );
};

NotificationMessage.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            closeOnClick : PropTypes.func,
            delay        : PropTypes.number,
            header       : PropTypes.string,
            is_auto_close: PropTypes.bool,
            message      : PropTypes.string,
            size         : PropTypes.oneOf(['small']),
            type         : PropTypes.oneOf(['error', 'info', 'success', 'danger']),
        }),
    ),
    removeNotification: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        notifications     : ui.notifications,
        removeNotification: ui.removeNotification,
    })
)(NotificationMessage);
