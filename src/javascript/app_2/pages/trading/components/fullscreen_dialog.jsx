import React from 'react';

const FullscreenDialog = ({ title, onClose, visible, children }) => {
    if (!visible) return null;

    return (
        <div className='fullscreen-dialog'>
            <h1 className='fullscreen-dialog__title'>
                {title}
            </h1>
            <div className='fullscreen-dialog__content'>
                {children}
            </div>
            <div className='fullscreen-dialog__footer'>
                <button onClick={onClose}>close</button>
            </div>
        </div>
    );
}

export default FullscreenDialog;