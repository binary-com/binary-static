import React from 'react';

class FullscreenDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidUpdate() {
        const scroll_lock_classname = 'no-scroll';

        if (this.props.visible) {
            document.body.classList.add(scroll_lock_classname);
        }
        else {
            document.body.classList.remove(scroll_lock_classname);
        }
    }

    handleClose() {
        this.props.onClose();
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
            <div className='fullscreen-dialog'>
                {this.renderTitle()}
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