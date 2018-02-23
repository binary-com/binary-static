import React from 'react';
import Button from './form/button';

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

    renderTitle() {
        if (!this.props.title) return null;
        return (
            <h1 className='fullscreen-dialog__title'>
                {this.props.title}
            </h1>
        );
    }

    render() {
        const { title, visible, children } = this.props;

        if (!visible) return null;

        return (
            <div
                ref={(dialogEl) => { this.dialogEl = dialogEl; }}
                className='fullscreen-dialog'
            >
                {this.renderTitle()}
                <div className='fullscreen-dialog__content'>
                    {children}
                </div>
                <div className='fullscreen-dialog__footer'>
                    <Button
                        className='flat'
                        handleClick={this.handleClose}
                        text='Close'
                    />
                </div>
            </div>
        );
    }
}

export default FullscreenDialog;