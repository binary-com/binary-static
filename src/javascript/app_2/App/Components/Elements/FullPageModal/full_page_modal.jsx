import React     from 'react';

const FullPageModal     = ({ title, body, onConfirm, buttonText, show }) => {
    if (show) {
        return (
            <div className='FullPageModal'>
                <div className='ModalDialog'>
                    <h1>{title}</h1>
                    <p>{body}</p>
                    <div
                        className='btn flat effect primary'
                        onClick={onConfirm}
                    >
                        <span>{buttonText}</span>
                    </div>
                </div>
            </div>
        );
    }

    return <React.Fragment />;
};

export default FullPageModal;
