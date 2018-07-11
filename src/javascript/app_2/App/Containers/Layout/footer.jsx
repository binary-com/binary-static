import PropTypes       from 'prop-types';
import React           from 'react';
import Popover         from '../../Components/Elements/popover.jsx';
import ServerTime      from '../../Containers/server_time.jsx';
import SettingsDialog  from '../../Components/Elements/SettingsDialog/settings_dialog.jsx';
import { BinaryLink }  from '../../routes';
import { connect }     from '../../../Stores/connect';

const TogglePortfolioDrawer = ({...props}) => (
    <Popover
        subtitle='Quick Portfolio'
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
                subtitle='Fullscreen'
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

const Settings = ({...props}) => (
    <React.Fragment>
        <Popover
            subtitle='Settings'
            alignment='top-right'
        >
            <a
                href='javascript:;'
                className='ic-settings'
                onClick={props.toggleSettingsDialog}
            />
        </Popover>
        <SettingsDialog
            is_open={props.is_settings_dialog_on}
            toggleDialog={props.toggleSettingsDialog}
            is_language_dialog_visible={props.is_language_dialog_visible}
        />
    </React.Fragment>
);

class Footer extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ServerTime />
                <div className='footer-links'>
                    <TogglePortfolioDrawer {...this.props} />
                    {!!(this.props.items && this.props.items.length) &&
                        this.props.items.map((item, idx) => (
                            <Popover
                                key={idx}
                                subtitle={item.text}
                            >
                                <BinaryLink key={idx} to={item.link_to} className={item.icon}>
                                    <span title={item.text} />
                                </BinaryLink>
                            </Popover>
                        ))}
                    <Settings {...this.props} />
                    <ToggleFullScreen />
                </div>
            </React.Fragment>
        );
    }
}

Footer.propTypes = {
    items: PropTypes.array,
};

TogglePortfolioDrawer.propTypes = {
    is_portfolio_drawer_on: PropTypes.bool,
    togglePortfolioDrawer : PropTypes.func,
};

Settings.propTypes = {
    toggleSettingsDialog      : PropTypes.func,
    is_language_dialog_visible: PropTypes.bool,
    is_settings_dialog_on     : PropTypes.bool,

};

export default connect(
    ({ ui }) => ({
        is_language_dialog_visible: ui.is_language_dialog_on,
        is_portfolio_drawer_on    : ui.is_portfolio_drawer_on,
        is_settings_dialog_on     : ui.is_settings_dialog_on,
        togglePortfolioDrawer     : ui.togglePortfolioDrawer,
        toggleSettingsDialog      : ui.toggleSettingsDialog,
    })
)(Footer);
