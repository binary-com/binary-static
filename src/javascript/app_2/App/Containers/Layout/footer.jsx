import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { connect }                    from 'Stores/connect';
import ServerTime                     from '../server-time.jsx';
import {
    NetworkStatus,
    ToggleFullScreen,
    TogglePositions,
    ToggleSettings }  from '../../Components/Layout/Footer';

const Footer = ({
    active_positions,
    is_language_dialog_visible,
    is_logged_in,
    is_positions_drawer_on,
    is_settings_dialog_on,
    network_status,
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
                    positions_count={active_positions.length || 0}
                />
            }
        </div>
        <NetworkStatus status={network_status} />
        <ServerTime />
        <div className='footer__links'>
            <ToggleFullScreen />
            <ToggleSettings
                is_language_visible={is_language_dialog_visible}
                is_settings_visible={is_settings_dialog_on}
                toggleSettings={toggleSettingsDialog}
            />
        </div>
    </React.Fragment>
);

Footer.propTypes = {
    active_positions          : MobxPropTypes.arrayOrObservableArray,
    is_language_dialog_visible: PropTypes.bool,
    is_logged_in              : PropTypes.bool,
    is_positions_drawer_on    : PropTypes.bool,
    is_settings_dialog_on     : PropTypes.bool,
    network_status            : PropTypes.object,
    togglePositionsDrawer     : PropTypes.func,
    toggleSettingsDialog      : PropTypes.func,
};

export default connect(
    ({ client, common, modules, ui }) => ({
        is_logged_in              : client.is_logged_in,
        active_positions          : modules.portfolio.active_positions,
        network_status            : common.network_status,
        is_language_dialog_visible: ui.is_language_dialog_on,
        is_positions_drawer_on    : ui.is_positions_drawer_on,
        is_settings_dialog_on     : ui.is_settings_dialog_on,
        togglePositionsDrawer     : ui.togglePositionsDrawer,
        toggleSettingsDialog      : ui.toggleSettingsDialog,
    })
)(Footer);
