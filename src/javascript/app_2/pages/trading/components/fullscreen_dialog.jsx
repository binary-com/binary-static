import React from 'react';

class FullscreenDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidUpdate() {
        const scroll_lock_classname = 'fullscreen-dialog-scroll-lock';

        if (this.props.visible) {
            document.body.classList.add(scroll_lock_classname);
        }
        else {
            document.body.classList.remove(scroll_lock_classname);
        }
        console.log('updated');
    }

    handleClose() {
        this.props.onClose();
    }

    render() {
        const { title, visible, children } = this.props;

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
                    <button onClick={this.handleClose}>close</button>
                </div>
            </div>
        );
    }
}

export default FullscreenDialog;