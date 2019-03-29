import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { CSSTransition } from 'react-transition-group';
import { IconClose }     from 'Assets/Common';

class NotificationBar extends React.Component {
    state = {};

    componentDidMount() {
        if (!this.state.show) {
            this.timer = setTimeout(() => {
                this.setState({ show: true });
            }, this.props.autoShow || 500);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    onClose = () => {
        this.setState({ show: false }, () => {
            clearTimeout(this.timer);
        });
    }

    render() {
        const {
            className,
            content,
            duration,
            type, // TODO: add support for different type of notifications
        } = this.props;

        return (
            <CSSTransition
                in={this.state.show}
                timeout={duration || 500}
                classNames={{
                    enterDone: 'notification-bar--is-active',
                }}
                unmountOnExit
            >
                <div
                    className={classNames('notification-bar', {
                        'notification-bar--info': type === 'info',
                        className,
                    })}
                >
                    <div className='notification-bar__message'>
                        {content}
                    </div>
                    <div
                        onClick={this.onClose.bind(this)}
                        className='notification-bar__button'
                    >
                        <IconClose className='notification-bar__icon' />
                    </div>
                </div>
            </CSSTransition>
        );
    }
}

NotificationBar.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string,
    message  : PropTypes.string,
    type     : PropTypes.string,
};

export default NotificationBar;
