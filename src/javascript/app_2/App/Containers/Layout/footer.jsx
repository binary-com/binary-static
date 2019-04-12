import PropTypes      from 'prop-types';
import React          from 'react';
import { connect }    from 'Stores/connect';
import ServerTime     from '../server-time.jsx';
import {
    NetworkStatus,
    ToggleFullScreen,
    TogglePositions,
    ToggleSettings }  from '../../Components/Layout/Footer';

const Footer = ({
    hideBlur,
    is_dark_mode,
    is_language_dialog_visible,
    is_logged_in,
    is_positions_drawer_on,
    is_settings_dialog_on,
    showBlur,
    togglePositionsDrawer,
    toggleSettingsDialog,
}) => (
    <React.Fragment>
        <div className='footer__links footer__links--left'>
            {
                is_logged_in &&
                <TogglePositions
                    is_positions_drawer_on={is_positions_drawer_on}
                    togglePositionsDrawer={togglePositionsDrawer}
                />
            }
        </div>
        <NetworkStatus />
        <ServerTime />
        <div className='footer__links'>
            <ToggleSettings
                is_dark_mode={is_dark_mode}
                is_language_visible={is_language_dialog_visible}
                is_settings_visible={is_settings_dialog_on}
                toggleSettings={toggleSettingsDialog}
                showBlur={showBlur}
                hideBlur={hideBlur}
            />
            <ToggleFullScreen />
        </div>
    </React.Fragment>
);

Footer.propTypes = {
    is_dark_mode              : PropTypes.bool,
    is_language_dialog_visible: PropTypes.bool,
    is_logged_in              : PropTypes.bool,
    is_positions_drawer_on    : PropTypes.bool,
    is_settings_dialog_on     : PropTypes.bool,
    togglePositionsDrawer     : PropTypes.func,
    toggleSettingsDialog      : PropTypes.func,
};

export default connect(
    ({ client, ui }) => ({
        hideBlur                  : ui.hideBlur,
        is_dark_mode              : ui.is_dark_mode_on,
        is_logged_in              : client.is_logged_in,
        is_language_dialog_visible: ui.is_language_dialog_on,
        is_positions_drawer_on    : ui.is_positions_drawer_on,
        is_settings_dialog_on     : ui.is_settings_dialog_on,
        showBlur                  : ui.showBlur,
        togglePositionsDrawer     : ui.togglePositionsDrawer,
        toggleSettingsDialog      : ui.toggleSettingsDialog,
    })
)(Footer);
