import { SmartChart }   from '@binary-com/smartcharts';
import PropTypes        from 'prop-types';
import React            from 'react';
import { symbolChange } from '../Helpers/symbol';
import { connect }      from '../../../Stores/connect';

class Chart extends React.Component {
    componentWillUnmount() { this.props.onUnmount(); }

    render() {
        const onSymbolChange = symbolChange(this.props.onSymbolChange);

        return (
            <SmartChart
                barriers={this.props.barriers_array}
                initialSymbol={this.props.initial_symbol}
                isMobile={this.props.is_mobile}
                onSymbolChange={onSymbolChange}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
            />
        );
    }
}

Chart.propTypes = {
    barriers_array: PropTypes.array,
    initial_symbol: PropTypes.string,
    is_mobile     : PropTypes.bool,
    onSymbolChange: PropTypes.func,
    onUnmount     : PropTypes.func,
    settings      : PropTypes.object,
    wsForget      : PropTypes.func,
    wsSendRequest : PropTypes.func,
    wsSubscribe   : PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        barriers_array: modules.smart_chart.barriers_array,
        onUnmount     : modules.smart_chart.onUnmount,
        settings      : modules.smart_chart.settings,
        wsForget      : modules.smart_chart.wsForget,
        wsSendRequest : modules.smart_chart.wsSendRequest,
        wsSubscribe   : modules.smart_chart.wsSubscribe,
        is_mobile     : ui.is_mobile,
    })
)(Chart);
