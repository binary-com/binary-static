import PropTypes             from 'prop-types';
import React                 from 'react';
import Popover               from '../../Components/Elements/popover.jsx';
import TogglePortfolioDrawer from '../../Components/Layout/Footer/toggle_portfolio.jsx';
import ToggleSettings        from '../../Components/Layout/Footer/toggle_settings.jsx';
import ToggleFullScreen      from '../../Components/Layout/Footer/toggle_fullscreen.jsx';
import ServerTime            from '../../Containers/server_time.jsx';
import { BinaryLink }        from '../../routes';
import { connect }           from '../../../Stores/connect';

class Footer extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ServerTime />
                <div className='footer-links'>
                    <TogglePortfolioDrawer
                        is_portfolio_drawer_on={this.props.is_portfolio_drawer_on}
                        togglePortfolioDrawer={this.props.togglePortfolioDrawer}
                    />
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
                    <ToggleSettings
                        is_settings_visible={this.props.is_settings_dialog_on}
                        is_language_visible={this.props.is_language_dialog_visible}
                        toggleSettings={this.props.toggleSettingsDialog}
                    />
                    <ToggleFullScreen />
                </div>
            </React.Fragment>
        );
    }
}

Footer.propTypes = {
    items                     : PropTypes.array,
    is_language_dialog_visible: PropTypes.bool,
    is_portfolio_drawer_on    : PropTypes.bool,
    is_settings_dialog_on     : PropTypes.bool,
    togglePortfolioDrawer     : PropTypes.func,
    toggleSettingsDialog      : PropTypes.func,
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
