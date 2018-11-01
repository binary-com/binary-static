import React       from 'react';
import PropTypes   from 'prop-types';

const FullPageModal = ({
    body,
    cancel_button_text,
    confirm_button_text,
    onConfirm,
    onCancel,
    show,
    title,
}) => {
    if (show) {
        return (
            <div className='full-page-modal'>
                <div className='modal-dialog'>
                    <h1>{title}</h1>
                    <p>{body}</p>
                    <div className='modal-footer'>
                        <div
                            className='btn flat effect primary'
                            onClick={onCancel}
                        >
                            <span>{cancel_button_text}</span>
                        </div>
                        <div
                            className='btn flat effect primary'
                            onClick={() => onConfirm()}
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
    body               : PropTypes.string,
    cancel_button_text : PropTypes.string,
    confirm_button_text: PropTypes.string,
    onCancel           : PropTypes.func,
    onConfirm          : PropTypes.func,
    show               : PropTypes.bool,
    title              : PropTypes.string,
};

export default FullPageModal;
