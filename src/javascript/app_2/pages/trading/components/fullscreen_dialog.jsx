import React from 'react';
import Url from '../../../../_common/url';

const scroll_lock_classname = 'no-scroll';
const open_dialog_classname = 'fullscreen-dialog--open';

class FullscreenDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidUpdate() {
        if (this.props.visible) {
            document.body.classList.add(scroll_lock_classname);
            // timeout to force transition animation
            window.setTimeout(() => {
                this.dialogEl.classList.add(open_dialog_classname);
            }, 0);
        }
        else {
            document.body.classList.remove(scroll_lock_classname);
        }
    }

    handleClose() {
        function transitionendHandler(e) {
            e.target.removeEventListener(e.type, transitionendHandler);
            this.props.onClose();
        }

        this.dialogEl.addEventListener('transitionend', transitionendHandler.bind(this));
        this.dialogEl.classList.remove(open_dialog_classname);
    }

    render() {
        const { title, visible, children } = this.props;

        if (!visible) return null;

        return (
            <div
                ref={(dialogEl) => { this.dialogEl = dialogEl; }}
                className='fullscreen-dialog'
            >
                <div className='fullscreen-dialog__header'>
                    <h2 className='fullscreen-dialog__title'>
                        {title}
                    </h2>
                    <div
                        className='icons btn-close fullscreen-dialog__close-btn'
                        onClick={this.handleClose}
                    >
                        <img src={Url.urlForStatic('images/trading_app/common/close.svg')} alt='Close' />
                    </div>
                </div>
                <div className='fullscreen-dialog__header-shadow-cover' />
                <div className='fullscreen-dialog__header-shadow shadow' />
                <div className='fullscreen-dialog__content'>
                    {children}
                </div>
            </div>
        );
    }
}

export default FullscreenDialog;