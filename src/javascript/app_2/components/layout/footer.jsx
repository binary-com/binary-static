import React from 'react';
import Popover from '../elements/popover.jsx';
import { connect } from '../../store/connect';
import { BinaryLink } from '../../routes';

const TogglePortfolioDrawer = ({...props}) => (
    <Popover
        subtitle='Toggle Portfolio'
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
                subtitle='Toggle Fullscreen'
                alignment='top-right'
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
                            <Popover
                                key={idx}
                                subtitle={item.text}
                            >
                                <BinaryLink key={idx} to={item.link_to} className={item.icon}>
                                    <span title={item.text} />
                                </BinaryLink>
                            </Popover>
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
