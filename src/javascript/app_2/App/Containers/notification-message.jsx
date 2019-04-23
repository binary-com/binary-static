import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from 'Stores/connect';
import Notification  from '../Components/Elements/NotificationMessage';

class NotificationMessage extends React.Component {
    render() {
        return (
            <div className='notification-container'>
                {
                    this.props.notifications.map((notification, idx) => (
                        <Notification
                            key={idx}
                            data={notification}
                            removeNotification={this.props.removeNotification}
                        />
                    ))
                }
            </div>
        );
    }
}

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
