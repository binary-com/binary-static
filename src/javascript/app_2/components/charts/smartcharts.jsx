import React from 'react';
import PropTypes from 'prop-types';
import { SmartChart } from '@binary-com/smartcharts';
import DAO from '../../data/dao';
import { connect } from '../../store/connect';

const subscribe = (request_object, callback) => {
    if (request_object.subscribe !== 1) return;
    DAO.subscribeTicksHistory(request_object, callback);
};

const forget = (match_values, callback) => (
    DAO.forget('ticks_history', callback, match_values)
);

const SmartCharts = ({ onSymbolChange }) =>  {
    const is_mobile = window.innerWidth <= 767;
    return (
        <React.Fragment>
            <SmartChart
                requestSubscribe={subscribe}
                requestForget={forget}
                requestAPI={DAO.sendRequest.bind(DAO)}
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
    ({trade}) => ({
        onSymbolChange: trade.handleChange,
        initial_symbol: trade.symbol,
    })
)(SmartCharts);
