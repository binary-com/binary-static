import PropTypes   from 'prop-types';
import React       from 'react';
import classNames  from 'classnames';
import CloseButton from './close_button.jsx';
import {
    DEFAULT_DELAY,
    POSITIONS,
    TYPES }        from './constants';

const Toast = ({
    data,
    removeToastMessage,
}) => {
    const destroy = (is_closed_by_user) => {
        removeToastMessage(data);

        if (typeof data.closeOnClick === 'function') {
            data.closeOnClick(data, is_closed_by_user);
        }
    };

    const onClick = () => destroy(true);

    if (data.is_auto_close || data.is_auto_close === undefined) {
        setTimeout(destroy, data.delay || DEFAULT_DELAY);
    }

    return (
        <div
            className={classNames('toast__body', POSITIONS.TOP_RIGHT, data.position, TYPES[data.type.toUpperCase()])}
            onClick={onClick}
        >
            <div className='toast__body__icon'>
                <span className={`toast__body__icon--${data.type.toLowerCase()}`} />
            </div>
            <div className='toast__body__message'>
                {data.message}
            </div>
            <CloseButton onClick={onClick} />
        </div>
    );
};

Toast.propTypes = {
    data: PropTypes.shape({
        closeOnClick : PropTypes.func,
        delay        : PropTypes.number,
        is_auto_close: PropTypes.bool,
        message      : PropTypes.node,
        position     : PropTypes.string,
        type         : PropTypes.string,
    }),
    removeToastMessage: PropTypes.func,
};

export default Toast;

