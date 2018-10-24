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
    let animation_class_name = 'toast__bounce-enter';
    const destroy = () => removeToastMessage(data);

    if (!data.auto_close) {
        setTimeout(destroy, data.delay || DEFAULT_DELAY);
    }

    return (
        <div
            className={classNames('toast__body', POSITIONS.TOP_RIGHT, data.position, TYPES[data.type.toUpperCase()])}
            onClick={destroy}
        >
            <div className='toast__body__icon'>
                <span className={`toast__body__icon--${data.type.toLowerCase()}`} />
            </div>
            <div className='toast__body__message'>
                {data.message}
            </div>
            <CloseButton onClick={destroy} />
        </div>
    );
};

Toast.propTypes = {
    data: PropTypes.shape({
        auto_close  : PropTypes.bool,
        closeOnClick: PropTypes.bool,
        delay       : PropTypes.number,
        message     : PropTypes.node,
        position    : PropTypes.string,
        type        : PropTypes.string,
    }),
    removeToastMessage: PropTypes.func,
};

export default Toast;

