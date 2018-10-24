import React     from 'react';
import PropTypes from 'prop-types';

const FullPageModal = ({ title, body, onConfirm, confirmButtonText, onCancel, cancelButtonText, show }) => {
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
                            <span>{cancelButtonText}</span>
                        </div>
                        <div
                            className='btn flat effect primary'
                            onClick={onConfirm}
                        >
                            <span>{confirmButtonText}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <React.Fragment />;
};

FullPageModal.propTypes = {
    body             : PropTypes.string,
    cancelButtonText : PropTypes.string,
    confirmButtonText: PropTypes.string,
    onCancel         : PropTypes.func,
    onConfirm        : PropTypes.func,
    title            : PropTypes.string,
};

export default FullPageModal;
