import React from 'react';
import Popover from './popover.jsx';
import { connect } from '../../store/connect';

const TogglePortfolioDrawer = ({...props}) => (
    <Popover
        title='Open positions'
        subtitle='Toggle Portfolio Quick Menu to view current running portfolio'
    >
        <a href='javascript:;'
           className={`${props.isPortfolioDrawerOn ? 'ic-portfolio-active' : 'ic-portfolio' }`}
           onClick={props.togglePortfolioDrawer}
        />
    </Popover>
);

class ToggleFullScreen extends React.Component {
    constructor(props) {
        super(props);
        this.enterFullScreen = this.enterFullScreen.bind(this);
        this.exitFullScreen  = this.exitFullScreen.bind(this);

        this.state = { isFullScreen: false };
    }

    componentWillMount() {
        document.addEventListener('webkitfullscreenchange', this.onFullScreen, false);
        document.addEventListener('mozfullscreenchange', this.onFullScreen, false);
        document.addEventListener('fullscreenchange', this.onFullScreen, false);
        document.addEventListener('MSFullscreenChange', this.onFullScreen, false);
    }

    onFullScreen = () => {
        const fullscreenElement =  document.fullscreenElement || document.mozFullScreenElement ||
            document.webkitFullscreenElement || document.msFullscreenElement;
        if (fullscreenElement) {
            this.setState({ isFullScreen: true });
        } else {
            this.setState({ isFullScreen: false });
        }
    };

    enterFullScreen(e) {
        e.stopPropagation();
        const el = document.documentElement;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        } else {
            this.setState({ isFullScreen: false }); // fullscreen API is not enabled
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
            this.setState({ isFullScreen: false }); // fullscreen API is not enabled
        }
    }

    render() {
        return (
            <Popover
                subtitle='Toggle full screen'
                placement='topRight'
            >
                <a href='javascript:;'
                   className='ic-fullscreen'
                   onClick={this.state.isFullScreen ? this.exitFullScreen : this.enterFullScreen}
                />
            </Popover>
        );
    }
}

class TradingFooter extends React.Component {
    render() {
        return (
            <React.Fragment>
            {this.props.items.length &&
                <div className='footer-links'>
                    <TogglePortfolioDrawer {...this.props} />
                    {this.props.items.map((item, idx) => (
                        <a key={idx} href={item.href || 'javascript:;'}>
                            <span className={item.icon} title={item.text} />
                        </a>
                    ))}
                    <ToggleFullScreen />
                </div>
            }
            </React.Fragment>
        );
    }
}

export default connect(
    ({ui}) => ({
        isPortfolioDrawerOn  : ui.isPortfolioDrawerOn,
        togglePortfolioDrawer: ui.togglePortfolioDrawer,
    })
)(TradingFooter);