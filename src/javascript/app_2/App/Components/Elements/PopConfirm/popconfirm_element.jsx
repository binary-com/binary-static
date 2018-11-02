import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React               from 'react';
import { IconExclamation } from 'Assets/Common';

const PopConfirmElement = ({
    alignment,
    cancel_text,
    confirm_text,
    is_visible,
    message,
    onClose,
    onConfirm,
    wrapperRef,
}) => {
    const popconfirm_class = classNames('popconfirm', alignment, {
        'open': is_visible,
    });
    return (
        <div ref={wrapperRef} className={popconfirm_class}>
            <div className='popconfirm-title'>
                <IconExclamation />
                <h4>{message}</h4>
            </div>
            <div className='popconfirm-buttons'>
                <div
                    className='btn flat effect'
                    onClick={onClose}
                >
                    <span>{cancel_text}</span>
                </div>
                <div
                    className='btn flat effect'
                    onClick={onConfirm}
                >
                    <span>{confirm_text}</span>
                </div>
            </div>
        </div>
    );
};

PopConfirmElement.propTypes = {
    alignment   : PropTypes.string,
    cancel_text : PropTypes.string,
    confirm_text: PropTypes.string,
    is_visible  : PropTypes.bool,
    message     : PropTypes.string,
    onClose     : PropTypes.func,
    onConfirm   : PropTypes.func,
    wrapperRef  : PropTypes.func,
};

export { PopConfirmElement };
