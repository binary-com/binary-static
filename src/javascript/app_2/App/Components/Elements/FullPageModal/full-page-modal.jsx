import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';
import Button     from 'App/Components/Form/button.jsx';

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
                        <Button
                            className={classNames('full-page-modal__button', 'btn--secondary btn--secondary--orange')}
                            has_effect
                            text={cancel_button_text}
                            onClick={onCancel}
                        />
                        <Button
                            className={classNames('full-page-modal__button', 'btn--primary btn--primary--orange')}
                            has_effect
                            text={confirm_button_text}
                            onClick={onConfirm}
                        />
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
