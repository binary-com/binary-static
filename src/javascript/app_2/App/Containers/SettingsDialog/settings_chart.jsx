import React           from 'react';
import PropTypes       from 'prop-types';
import SettingsControl from '../../Components/Elements/SettingsDialog/settings_control.jsx';
import { connect }     from '../../../Stores/connect';

const ChartSettings = ({
      is_asset_visible,
      is_countdown_visible,
      is_layout_default,
      toggleAsset,
      toggleCountdown,
      toggleLayout }) => (
          <div className='tab-content'>
              <div className='chart-setting-container'>
                  <SettingsControl
                      name='position'
                      toggle={toggleLayout}
                      to_toggle={is_layout_default}
                      style='toggle-chart-layout'
                  />
                  <SettingsControl
                      name='asset information'
                      toggle={toggleAsset}
                      to_toggle={is_asset_visible}
                  />
                  <SettingsControl
                      name='scale countdown'
                      toggle={toggleCountdown}
                      to_toggle={is_countdown_visible}
                  />
              </div>
          </div>
);

ChartSettings.propTypes = {
    is_layout_default   : PropTypes.bool,
    is_asset_visible    : PropTypes.bool,
    is_countdown_visible: PropTypes.bool,
    toggleAsset         : PropTypes.func,
    toggleCountdown     : PropTypes.func,
    toggleLayout        : PropTypes.func,
};

const chart_settings_component =  connect(
    ({ ui }) => ({
        is_layout_default   : ui.is_chart_layout_default,
        is_asset_visible    : ui.is_chart_asset_info_visible,
        is_countdown_visible: ui.is_chart_countdown_visible,
        toggleAsset         : ui.toggleChartAssetInfo,
        toggleCountdown     : ui.toggleChartCountdown,
        toggleLayout        : ui.toggleChartLayout,
    })
)(ChartSettings);

export { chart_settings_component as ChartSettings };
