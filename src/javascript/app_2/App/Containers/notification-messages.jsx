import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from 'Stores/connect';
import Notification  from '../Components/Elements/NotificationMessage';

const NotificationMessages = ({
    notification_messages,
    removeNotification,
}) => {
    const MAX_DISPLAY_NOTIFICATIONS = 3;

    return (
        <div className='notification-messages'>
            {
                notification_messages.slice(0, MAX_DISPLAY_NOTIFICATIONS).map((notification, idx) => (
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

NotificationMessages.propTypes = {
    notification_messages: PropTypes.arrayOf(
        PropTypes.shape({
            closeOnClick : PropTypes.func,
            delay        : PropTypes.number,
            header       : PropTypes.string,
            is_auto_close: PropTypes.bool,
            message      : PropTypes.string,
            size         : PropTypes.oneOf(['small']),
            type         : PropTypes.oneOf(['warning', 'info', 'success', 'danger']),
        }),
    ),
    removeNotification: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        notification_messages: ui.notification_messages,
        removeNotification   : ui.removeNotification,
    })
)(NotificationMessages);
