import PropTypes        from 'prop-types';
import React            from 'react';
import classNames       from 'classnames';
import {
    Icon,
    IconError }         from 'Assets/Common';
import { IconInfoBlue } from 'Assets/Common/icon-info-blue.jsx';
import { IconWarning }  from 'Assets/Common/icon-warning.jsx';
import { IconSuccess }  from 'Assets/Common/icon-success.jsx';
import CloseButton      from './close-button.jsx';
import {
    DEFAULT_DELAY,
    TYPES }             from './constants';

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
        // setTimeout(destroy, data.delay || DEFAULT_DELAY);
    }

    return (
        <div className={
            classNames('toast-message', TYPES[data.type.toUpperCase()], {
                'toast-message--small': data.size === 'small',
            })}
        >
            <div className='toast-message__icon'>
                { data.type === 'error'   && <Icon icon={IconError} className='toast-message__icon-type' /> }
                { data.type === 'info'    && <Icon icon={IconInfoBlue} className='toast-message__icon-type' /> }
                { data.type === 'success' && <Icon icon={IconSuccess} className='toast-message__icon-type' /> }
                { data.type === 'warning' && <Icon icon={IconWarning} className='toast-message__icon-type' /> }
            </div>
            <div className='toast-message__text-container'>
                <div className='toast-message__header'>
                    <h4>{data.header}</h4>
                </div>
                <p className='toast-message__message-text'>
                    {data.message}
                </p>
            </div>
            {/* <CloseButton onClick={onClick} /> */}
        </div>
    );
};

Toast.defaultProps = {
    type: 'info',
};

Toast.propTypes = {
    data: PropTypes.shape({
        closeOnClick : PropTypes.func,
        delay        : PropTypes.number,
        header       : PropTypes.string,
        is_auto_close: PropTypes.bool,
        message      : PropTypes.string,
        size         : PropTypes.oneOf(['small']),
        type         : PropTypes.oneOf(['error', 'info', 'success', 'warning']),
    }),
    removeToastMessage: PropTypes.func,
};

export default Toast;

