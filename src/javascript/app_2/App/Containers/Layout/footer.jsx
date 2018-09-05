import PropTypes      from 'prop-types';
import React          from 'react';
import ServerTime     from '../server_time.jsx';
import {
    ToggleFullScreen,
    TogglePortfolio,
    ToggleSettings }  from '../../Components/Layout/Footer';
import { connect }    from '../../../Stores/connect';

const Footer = ({
    is_logged_in,
    is_portfolio_drawer_on,
    is_language_dialog_visible,
    is_settings_dialog_on,
    toggleSettingsDialog,
    togglePortfolioDrawer,
}) => (
    <React.Fragment>
        <ServerTime />
        <div className='footer-links'>
            {
                is_logged_in &&
                <TogglePortfolio
                    is_portfolio_drawer_on={is_portfolio_drawer_on}
                    togglePortfolioDrawer={togglePortfolioDrawer}
                />
            }
            <ToggleFullScreen />
            <ToggleSettings
                is_settings_visible={is_settings_dialog_on}
                is_language_visible={is_language_dialog_visible}
                toggleSettings={toggleSettingsDialog}
            />
        </div>
    </React.Fragment>
);


Footer.propTypes = {
    is_language_dialog_visible: PropTypes.bool,
    is_logged_in              : PropTypes.bool,
    is_portfolio_drawer_on    : PropTypes.bool,
    is_settings_dialog_on     : PropTypes.bool,
    togglePortfolioDrawer     : PropTypes.func,
    toggleSettingsDialog      : PropTypes.func,
};

export default connect(
    ({ client, ui }) => ({
        is_logged_in              : client.is_logged_in,
        is_language_dialog_visible: ui.is_language_dialog_on,
        is_portfolio_drawer_on    : ui.is_portfolio_drawer_on,
        is_settings_dialog_on     : ui.is_settings_dialog_on,
        togglePortfolioDrawer     : ui.togglePortfolioDrawer,
        toggleSettingsDialog      : ui.toggleSettingsDialog,
    })
)(Footer);
