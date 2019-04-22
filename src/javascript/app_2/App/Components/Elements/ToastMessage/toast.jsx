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
        <div className={classNames('toast__body', TYPES[data.type.toUpperCase()])}>
            <div className='toast__icon'>
                { data.type === 'error'   && <Icon icon={IconError} className='toast__icon-type' /> }
                { data.type === 'info'    && <Icon icon={IconInfoBlue} className='toast__icon-type' /> }
                { data.type === 'success' && <Icon icon={IconSuccess} className='toast__icon-type' /> }
                { data.type === 'warning' && <Icon icon={IconWarning} className='toast__icon-type' /> }
            </div>
            <div className='toast__message'>
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
        type         : PropTypes.oneOf(['error', 'info', 'success', 'warning']),
    }),
    removeToastMessage: PropTypes.func,
};

export default Toast;

