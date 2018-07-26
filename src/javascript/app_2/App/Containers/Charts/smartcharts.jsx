import { SmartChart }      from '@binary-com/smartcharts';
import PropTypes           from 'prop-types';
import React               from 'react';
import {
    barriersObjectToArray,
    forget,
    subscribe }            from './helpers';
import { WS }              from '../../../Services';
import { connect }         from '../../../Stores/connect';

const SmartCharts = ({
    chart_barriers,
    initial_symbol,
    is_asset_enabled,
    is_countdown_enabled,
    is_dark_theme,
    is_position_default,
    is_mobile,
    onSymbolChange,
}) =>  {
    const barriers = barriersObjectToArray(chart_barriers);
    const settings = {
        assetInformation: is_asset_enabled,
        countdown       : is_countdown_enabled,
        lang            : 'en', // TODO - Update language to use saved/stored language
        position        : is_position_default ? 'left' : 'bottom',
        theme           : is_dark_theme ? 'dark' : 'light',
    };

    return (
        <React.Fragment>
            <SmartChart
                barriers={barriers}
                initialSymbol={initial_symbol}
                isMobile={is_mobile}
                onSymbolChange={onSymbolChange && ((symbol_obj) => {
                    onSymbolChange({
                        target: {
                            name : 'symbol',
                            value: symbol_obj.symbol,
                        },
                    });
                })}
                requestSubscribe={subscribe}
                requestForget={forget}
                requestAPI={WS.sendRequest.bind(WS)}
                settings={settings}
            />
        </React.Fragment>
    );
};

SmartCharts.propTypes = {
    chart_barriers      : PropTypes.object,
    initial_symbol      : PropTypes.string,
    is_asset_enabled    : PropTypes.bool,
    is_countdown_enabled: PropTypes.bool,
    is_dark_theme       : PropTypes.bool,
    is_mobile           : PropTypes.bool,
    is_position_default : PropTypes.bool,
    onSymbolChange      : PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        is_asset_enabled    : ui.is_chart_asset_info_visible,
        is_countdown_enabled: ui.is_chart_countdown_visible,
        is_dark_theme       : ui.is_dark_mode_on,
        is_mobile           : ui.is_mobile,
        is_position_default : ui.is_chart_layout_default,
    })
)(SmartCharts);
