import React from 'react';

const FullscreenDialog = ({ title, onClose, visible, children }) => {
    return (
        <div className={`fullscreen-dialog ${visible ? '' : 'fullscreen-dialog--hidden'}`}>
            <h1 className='fullscreen-dialog__title'>
                {title}
            </h1>
            <div className='fullscreen-dialog__content'>
                {children}
            </div>
            <div className='fullscreen-dialog__footer'>
                <button onClick={}>close</button>
            </div>
        </div>
    );
}

export default FullscreenDialog;