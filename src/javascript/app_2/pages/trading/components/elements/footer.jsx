import React from 'react';
import Popover from './popover.jsx';
import { connect } from '../../store/connect';

const TogglePortfolioDrawer = ({...props}) => (
    <Popover
        title='Open positions'
        subtitle='Toggle Portfolio Quick Menu to view current running portfolio'
    >
        <a
            href='javascript:;'
            className={`${props.is_portfolio_drawer_on ? 'ic-portfolio-active' : 'ic-portfolio' }`}
            onClick={props.togglePortfolioDrawer}
        />
    </Popover>
);

const fullscreen_map = {
    event    : ['fullscreenchange',  'webkitfullscreenchange',  'mozfullscreenchange',  'MSFullscreenChange'],
    element  : ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'],
    fnc_enter: ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'],
    fnc_exit : ['exitFullscreen',    'webkitExitFullscreen',    'mozCancelFullScreen',  'msExitFullscreen'],
};

class ToggleFullScreen extends React.Component {
    constructor(props) {
        super(props);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.state = {
            is_full_screen: false,
        };
    }

    componentWillMount() {
        fullscreen_map.event .forEach((event) => {
            document.addEventListener(event, this.onFullScreen, false);
        });
    }

    onFullScreen = () => {
        const is_full_screen = fullscreen_map.element.some(el => document[el]);
        this.setState({ is_full_screen });
    };

    toggleFullScreen(e) {
        e.stopPropagation();

        const to_exit   = this.state.is_full_screen;
        const el        = to_exit ? document : document.documentElement;
        const fncToCall = fullscreen_map[to_exit ? 'fnc_exit' : 'fnc_enter'].find(fnc => el[fnc]);

        if (fncToCall) {
            el[fncToCall]();
        } else {
            this.setState({ is_full_screen: false }); // fullscreen API is not enabled
        }
    }

    render() {
        return (
            <Popover
                subtitle='Toggle full screen'
                placement='topRight'
            >
                <a
                    href='javascript:;'
                    className='ic-fullscreen'
                    onClick={this.toggleFullScreen}
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
    ({ ui }) => ({
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
        togglePortfolioDrawer : ui.togglePortfolioDrawer,
    })
)(TradingFooter);
