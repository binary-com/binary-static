import PropTypes        from 'prop-types';
import React            from 'react';
import classNames       from 'classnames';
import { IconError }    from 'Assets/Common/icon_error.jsx';
import { IconInfoBlue } from 'Assets/Common/icon_info_blue.jsx';
import { IconWarning }  from 'Assets/Common/icon_warning.jsx';
import { IconSuccess }  from 'Assets/Common/icon_success.jsx';
import CloseButton      from './close_button.jsx';
import {
    DEFAULT_DELAY,
    POSITIONS,
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
        setTimeout(destroy, data.delay || DEFAULT_DELAY);
    }

    return (
        <div
            className={classNames('toast__body', POSITIONS.TOP_RIGHT, data.position, TYPES[data.type.toUpperCase()])}
            onClick={onClick}
        >
            <div className='toast__body__icon'>
                { data.type === 'ERROR'   && <IconError /> }
                { data.type === 'INFO'    && <IconInfoBlue /> }
                { data.type === 'SUCCESS' && <IconSuccess /> }
                { data.type === 'WARNING' && <IconWarning /> }
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

