import { SmartChart }    from '@binary-com/smartcharts';
import { toJS }          from 'mobx';
import { observer }      from 'mobx-react';
import PropTypes         from 'prop-types';
import React             from 'react';
import { WS }            from '../../../Services';
import { isEmptyObject } from '../../../../_common/utility';

const subscribe = (request_object, callback) => {
    if (request_object.subscribe !== 1) return;
    WS.subscribeTicksHistory(request_object, callback);
};

const forget = (match_values, callback) => (
    WS.forget('ticks_history', callback, match_values)
);

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
    const chart_layout = is_position_default ? 'left' : 'bottom';
    const chart_theme  = is_dark_theme ? 'dark' : 'light';

    const chart_settings = {
        assetInformation: is_asset_enabled,
        // TO-DO - Update language to use saved / stored language
        lang            : 'en',
        position        : chart_layout,
        countdown       : is_countdown_enabled,
        theme           : chart_theme,
    };
    const barriers = Object.keys(chart_barriers || {})
        .map(key => toJS(chart_barriers[key]))
        .filter(item => !isEmptyObject(item));

    return (
        <React.Fragment>
            <SmartChart
                requestSubscribe={subscribe}
                requestForget={forget}
                requestAPI={WS.sendRequest.bind(WS)}
                onSymbolChange={(symbol_obj) => {
                    onSymbolChange({
                        target: {
                            name : 'symbol',
                            value: symbol_obj.symbol,
                        },
                    });
                }}
                barriers={barriers}
                initialSymbol={initial_symbol}
                isMobile={is_mobile}
                settings={chart_settings}
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

export default observer(SmartCharts);
