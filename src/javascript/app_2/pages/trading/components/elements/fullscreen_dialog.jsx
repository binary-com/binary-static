import React from 'react';
import Url from '../../../../../_common/url';

class FullscreenDialog extends React.PureComponent {
    componentDidUpdate() {
        if (this.props.visible) {
            document.body.classList.add('no-scroll');
            document.getElementById('binary_app').classList.add('no-scroll');
        }
        else {
            document.body.classList.remove('no-scroll');
            document.getElementById('binary_app').classList.remove('no-scroll');
        }
    }

    scrollToElIfNeeded = (parent, el) => {
        const viewport_offset = el.getBoundingClientRect();
        const hidden = viewport_offset.top + el.clientHeight + 20 > window.innerHeight;
        if (hidden) {
            const new_el_top = (window.innerHeight - el.clientHeight) / 2;
            parent.scrollTop += viewport_offset.top - new_el_top;
        }
    }

    // sometimes input is covered by virtual keyboard on mobile chrome, uc browser
    handleClick = (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
            const scrollToTarget = this.scrollToElIfNeeded.bind(null, e.currentTarget, e.target);
            window.addEventListener('resize', scrollToTarget, false);

            // remove listener, resize is not fired on iOS safari
            window.setTimeout(() => {
                window.removeEventListener('resize', scrollToTarget, false);
            }, 2000);
        }
    }

    render() {
        const { title, visible, children } = this.props;

        return (
            <div
                className={`fullscreen-dialog ${visible ? 'fullscreen-dialog--open' : ''}`}
                onClick={this.handleClick.bind(this)}
            >
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
                <div className='fullscreen-dialog__header-shadow' />
                <div className='fullscreen-dialog__content'>
                    {children}
                </div>
            </div>
        );
    }
}

export default FullscreenDialog;
