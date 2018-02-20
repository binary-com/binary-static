import React from 'react';

class ToggleFullScreen extends React.Component {
    constructor(props) {
        super(props);
        this.enterFullScreen = this.enterFullScreen.bind(this);
        this.exitFullScreen  = this.exitFullScreen.bind(this);
    }

    componentWillMount() {
        this.setState({
            isFullScreen: false,
        });
    }

    enterFullScreen(e) {
        e.stopPropagation();
        const el = document.documentElement;
        this.setState({
            isDisabled  : false,
            isFullScreen: true,
        });
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        } else {
            this.setState({
                isDisabled  : true,
                isFullScreen: false,
            });
        }
    }

    exitFullScreen(e) {
        e.stopPropagation();
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else {
            this.setState({
                isDisabled: true,
            });
        }
        this.setState({
            isFullScreen: false,
        });
    }

    render() {
        return (
            <a href='javascript:;'
                className={this.props.className}
                onClick={this.state.isFullScreen ? this.exitFullScreen : this.enterFullScreen}
            >
                <span>FS</span>
            </a>

        );
    }
}

class TradingFooter extends React.Component {
    render() {
        return (
            <React.Fragment>
            {this.props.items.length &&
                <div className='footer-links'>
                    {this.props.items.map((item, idx) => (
                        <a key={idx} href={item.href || 'javascript:;'}>
                            <span className={item.icon}>{item.text}</span>
                        </a>
                    ))}
                    <ToggleFullScreen className='fs-icon' />
                </div>
            }
            </React.Fragment>
        );
    }
}

export default TradingFooter;