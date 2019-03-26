import PropTypes                     from 'prop-types';
import React                         from 'react';
import { localize }                  from '_common/localize';
import { connect }                   from 'Stores/connect';
import Localize                      from 'App/Components/Elements/localize.jsx';
import MediaItem, {
    MediaHeading,
    MediaIcon,
    MediaDescription,
}                                    from 'App/Components/Elements/Media';
import Checkbox                      from 'App/Components/Form/Checkbox';
import RadioGroup                    from 'App/Components/Form/Radio';
import OHLCDisabledLight             from 'Images/app_2/settings/OHLC-disabled.svg';
import OHLCEnabledLight              from 'Images/app_2/settings/OHLC-enabled.svg';
import ChartPositionEnabledLight     from 'Images/app_2/settings/bottom.svg';
import OHLCDisabledDark              from 'Images/app_2/settings/dark/OHLC-disabled.svg';
import OHLCEnabledDark               from 'Images/app_2/settings/dark/OHLC-enabled.svg';
import ChartPositionEnabledDark      from 'Images/app_2/settings/dark/bottom.svg';
import IntervalDurationDisabledDark  from 'Images/app_2/settings/dark/interval-disabled.svg';
import IntervalDurationEnabledDark   from 'Images/app_2/settings/dark/interval-enabled.svg';
import ChartPositionDisabledDark     from 'Images/app_2/settings/dark/left.svg';
import IntervalDurationDisabledLight from 'Images/app_2/settings/interval-disabled.svg';
import IntervalDurationEnabledLight  from 'Images/app_2/settings/interval-enabled.svg';
import ChartPositionDisabledLight    from 'Images/app_2/settings/left.svg';

const ChartSettings = ({
    is_asset_visible,
    is_countdown_visible,
    is_dark_mode,
    is_layout_default,
    toggleAsset,
    toggleCountdown,
    toggleLayout,
}) => (
    <div className='settings-chart'>
        <MediaItem>
            <MediaHeading>
                <Localize str='Toolbar position' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? ChartPositionDisabledDark : ChartPositionDisabledLight}
                    enabled={is_dark_mode ? ChartPositionEnabledDark : ChartPositionEnabledLight}
                    is_enabled={is_layout_default}
                />
                <div className='media__form'>
                    <p><Localize str='Change chart control positions' /></p>
                    <RadioGroup
                        items={[
                            {
                                label: 'Bottom',  // localization will be handled in RadioGroup
                                value: true,
                            },
                            {
                                label: 'Left',
                                value: false,
                            },
                        ]}
                        selected={is_layout_default}
                        onToggle={toggleLayout}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
        <MediaItem>
            <MediaHeading>
                <Localize str='Open-High-Low-Close (OHLC) information' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? OHLCDisabledDark : OHLCDisabledLight }
                    enabled={is_dark_mode ? OHLCEnabledDark : OHLCEnabledLight}
                    is_enabled={is_asset_visible}
                />
                <div className='media__form'>
                    <Checkbox
                        value={is_asset_visible}
                        label={localize('Display OHLC information for current chart')}
                        onClick={toggleAsset}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
        <MediaItem>
            <MediaHeading>
                <Localize str='Interval duration' />
            </MediaHeading>
            <MediaDescription>
                <MediaIcon
                    disabled={is_dark_mode ? IntervalDurationDisabledDark : IntervalDurationDisabledLight}
                    enabled={is_dark_mode ? IntervalDurationEnabledDark : IntervalDurationEnabledLight}
                    is_enabled={is_countdown_visible}
                />
                <div className='media__form'>
                    <Checkbox
                        value={is_countdown_visible}
                        label={localize('Display remaining time for each interval')}
                        onClick={toggleCountdown}
                    />
                </div>
            </MediaDescription>
        </MediaItem>
    </div>
);

ChartSettings.propTypes = {
    is_asset_visible    : PropTypes.bool,
    is_countdown_visible: PropTypes.bool,
    is_dark_mode        : PropTypes.bool,
    is_layout_default   : PropTypes.bool,
    toggleAsset         : PropTypes.func,
    toggleCountdown     : PropTypes.func,
    toggleLayout        : PropTypes.func,
};

export default connect(({ ui }) => (
    {
        is_asset_visible    : ui.is_chart_asset_info_visible,
        is_countdown_visible: ui.is_chart_countdown_visible,
        is_dark_mode        : ui.is_dark_mode_on,
        is_layout_default   : ui.is_chart_layout_default,
        toggleAsset         : ui.toggleChartAssetInfo,
        toggleCountdown     : ui.toggleChartCountdown,
        toggleLayout        : ui.toggleChartLayout,
    }
))(ChartSettings);
