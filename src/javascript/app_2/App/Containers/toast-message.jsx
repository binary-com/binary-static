import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from 'Stores/connect';
import Toast  from '../Components/Elements/ToastMessage';

class ToastMessage extends React.Component {
    render() {
        return (
            <div className='toast'>
                {
                    this.props.toast_messages.map((toast, idx) => (
                        <Toast
                            key={idx}
                            data={toast}
                            removeToastMessage={this.props.removeToastMessage}
                        />
                    ))
                }
            </div>
        );
    }
}

ToastMessage.propTypes = {
    removeToastMessage: PropTypes.func,
    toast_messages    : PropTypes.arrayOf(
        PropTypes.shape({
            closeOnClick : PropTypes.func,
            delay        : PropTypes.number,
            is_auto_close: PropTypes.bool,
            message      : PropTypes.node,
            type         : PropTypes.oneOf(['error', 'info', 'success', 'warning']),
        }),
    ),
};

export default connect(
    ({ ui }) => ({
        removeToastMessage: ui.removeToastMessage,
        toast_messages    : ui.toast_messages,
    })
)(ToastMessage);
