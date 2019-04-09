import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';
import posed,
{ PoseGroup }     from 'react-pose';
import Button     from 'App/Components/Form/button.jsx';

const ModalWrapper = posed.div({
    enter: {
        y         : 0,
        opacity   : 1,
        delay     : 300,
        transition: {
            y      : { type: 'spring', stiffness: 1000, damping: 15 },
            default: { duration: 300 },
        },
    },
    exit: {
        y         : 50,
        opacity   : 0,
        transition: { duration: 250 },
    },
});

const ModalBackground = posed.div({
    enter: { opacity: 1 },
    exit : { opacity: 0 },
});

const FullPageModal = ({
    cancel_button_text,
    children,
    confirm_button_text,
    onConfirm,
    onCancel,
    is_visible,
    title,
}) => (
    <PoseGroup>
        {is_visible && [
            <ModalBackground
                className='full-page-modal__background'
                key='full-page-modal__background'
            />,
            <ModalWrapper
                className='full-page-modal__wrapper'
                key='full-page-modal__wrapper'
            >
                <div className='full-page-modal__dialog'>
                    <h1 className='full-page-modal__header'>{title}</h1>
                    <p className='full-page-modal__content'>{children}</p>
                    <div className='full-page-modal__footer'>
                        { onCancel &&
                            <Button
                                className={classNames('full-page-modal__button', 'btn--secondary btn--secondary--orange')}
                                has_effect
                                text={cancel_button_text}
                                onClick={onCancel}
                            />
                        }
                        <Button
                            className={classNames('full-page-modal__button', 'btn--primary btn--primary--orange')}
                            has_effect
                            text={confirm_button_text}
                            onClick={onConfirm}
                        />
                    </div>
                </div>
            </ModalWrapper>,
        ]}
    </PoseGroup>
);

FullPageModal.propTypes = {
    cancel_button_text : PropTypes.string,
    confirm_button_text: PropTypes.string,
    is_visible         : PropTypes.bool,
    onCancel           : PropTypes.func,
    onConfirm          : PropTypes.func,
    title              : PropTypes.string,
};

export default FullPageModal;
