import { SmartChart } from '@binary-com/smartcharts';
import PropTypes      from 'prop-types';
import React          from 'react';
import WS             from '../../data/ws_methods';
import { connect }    from '../../store/connect';

const subscribe = (request_object, callback) => {
    if (request_object.subscribe !== 1) return;
    WS.subscribeTicksHistory(request_object, callback);
};

const forget = (match_values, callback) => (
    WS.forget('ticks_history', callback, match_values)
);

const SmartCharts = ({ onSymbolChange }) =>  {
    const is_mobile = window.innerWidth <= 767;
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
                isMobile={is_mobile}
            />
        </React.Fragment>
    );
};

SmartCharts.propTypes = {
    onSymbolChange: PropTypes.func,
};

export default connect(
    ({ trade }) => ({
        onSymbolChange: trade.handleChange,
        initial_symbol: trade.symbol,
    })
)(SmartCharts);
