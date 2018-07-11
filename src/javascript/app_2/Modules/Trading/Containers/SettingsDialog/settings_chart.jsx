import React           from 'react';
import PropTypes       from 'prop-types';
import SettingsControl from '../../../../App/Components/Elements/SettingsDialog/settings_control.jsx';
import { connect }     from '../../../../Stores/connect';

class ChartSettings extends React.Component {
    render() {
        return (
            <div className='tab-content'>
                <div className='chart-setting-container'>
                    <SettingsControl
                        name='position'
                        toggle={this.props.toggleLayout}
                        to_toggle={this.props.is_layout_default}
                        style='toggle-chart-layout'
                    />
                    <SettingsControl
                        name='asset information'
                        toggle={this.props.toggleAsset}
                        to_toggle={this.props.is_asset_visible}
                    />
                    <SettingsControl
                        name='scale countdown'
                        toggle={this.props.toggleCountdown}
                        to_toggle={this.props.is_countdown_visible}
                    />
                </div>
            </div>
        );
    }
};

ChartSettings.propTypes = {
    is_layout_default   : PropTypes.bool,
    is_asset_visible    : PropTypes.bool,
    is_countdown_visible: PropTypes.bool,
    toggleLayout        : PropTypes.func,
    toggleAsset         : PropTypes.func,
    toggleCountdown     : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        is_layout_default   : ui.is_chart_layout_default,
        is_asset_visible    : ui.is_chart_asset_info_visible,
        is_countdown_visible: ui.is_chart_countdown_visible,
        toggleLayout        : ui.toggleChartLayout,
        toggleAsset         : ui.toggleChartAssetInfo,
        toggleCountdown     : ui.toggleChartCountdown,
    })
)(ChartSettings);
