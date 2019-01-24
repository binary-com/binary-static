import React     from 'react';
import PropTypes from 'prop-types';

const FullPageModal = ({
    cancel_button_text,
    children,
    confirm_button_text,
    onConfirm,
    onCancel,
    is_visible,
    title,
}) => {
    if (is_visible) {
        return (
            <div className='full-page-modal'>
                <div className='modal-dialog'>
                    <h1>{title}</h1>
                    <p>{children}</p>
                    <div className='modal-footer'>
                        <div
                            className='btn flat effect primary'
                            onClick={onCancel}
                        >
                            <span>{cancel_button_text}</span>
                        </div>
                        <div
                            className='btn flat effect primary'
                            onClick={onConfirm}
                        >
                            <span>{confirm_button_text}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <React.Fragment />;
};

FullPageModal.propTypes = {
    cancel_button_text : PropTypes.string,
    confirm_button_text: PropTypes.string,
    is_visible         : PropTypes.bool,
    onCancel           : PropTypes.func,
    onConfirm          : PropTypes.func,
    title              : PropTypes.string,
};

export default FullPageModal;
