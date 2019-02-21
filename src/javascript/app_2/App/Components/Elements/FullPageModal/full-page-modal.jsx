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
                <div className='full-page-modal__dialog'>
                    <h1 className='full-page-modal__header'>{title}</h1>
                    <p className='full-page-modal__content'>{children}</p>
                    <div className='full-page-modal__footer'>
                        <div
                            className='full-page-modal__button btn btn--flat effect btn--primary'
                            onClick={onCancel}
                        >
                            <span className='full-page-modal__button-text'>{cancel_button_text}</span>
                        </div>
                        <div
                            className='full-page-modal__button btn btn--flat effect btn--primary'
                            onClick={onConfirm}
                        >
                            <span className='full-page-modal__button-text'>{confirm_button_text}</span>
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
