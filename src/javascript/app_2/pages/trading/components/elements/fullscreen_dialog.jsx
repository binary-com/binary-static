import React from 'react';
import Url from '../../../../../_common/url';

class FullscreenDialog extends React.PureComponent {
    componentDidUpdate() {
        if (this.props.visible) {
            document.body.classList.add('no-scroll');
        }
        else {
            document.body.classList.remove('no-scroll');
        }
    }

    render() {
        const { title, visible, children } = this.props;

        return (
            <div className={`fullscreen-dialog ${visible ? 'fullscreen-dialog--open' : ''}`}>
                <div className='fullscreen-dialog__header'>
                    <h2 className='fullscreen-dialog__title'>
                        {title}
                    </h2>
                    <div
                        className='icons btn-close fullscreen-dialog__close-btn'
                        onClick={this.props.onClose}
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