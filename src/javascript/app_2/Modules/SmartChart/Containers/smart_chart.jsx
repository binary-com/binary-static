import { SmartChart }   from '@binary-com/smartcharts';
import PropTypes        from 'prop-types';
import React            from 'react';
import ChartMarker      from '../Components/Markers/marker.jsx';
import TopWidgets       from '../Components/top_widgets.jsx';
import { symbolChange } from '../Helpers/symbol';
import { connect }      from '../../../Stores/connect';

class Chart extends React.Component {
    componentWillUnmount() { this.props.onUnmount(); }

    topWidgets = () => <TopWidgets
        is_title_enabled={this.props.is_title_enabled}
        onSymbolChange={symbolChange(this.props.onSymbolChange)}
    />;

    render() {
        return (
            <SmartChart
                barriers={this.props.barriers_array}
                chartType={this.props.chart_type}
                endEpoch={this.props.end_epoch}
                granularity={this.props.granularity}
                isMobile={this.props.is_mobile}
                requestAPI={this.props.wsSendRequest}
                requestForget={this.props.wsForget}
                requestSubscribe={this.props.wsSubscribe}
                settings={this.props.settings}
                startEpoch={this.props.start_epoch}
                symbol={this.props.symbol}
                topWidgets={this.topWidgets}
            >
                { this.props.markers_array.map((marker, idx) => (
                    <ChartMarker
                        key={idx}
                        marker_config={marker.marker_config}
                        marker_content_props={marker.content_config}
                    />
                ))}
            </SmartChart>
        );
    }
}

Chart.propTypes = {
    barriers_array  : PropTypes.array,
    chart_type      : PropTypes.string,
    end_epoch       : PropTypes.number,
    granularity     : PropTypes.number,
    is_title_enabled: PropTypes.bool,
    is_mobile       : PropTypes.bool,
    markers_array   : PropTypes.array,
    onSymbolChange  : PropTypes.func,
    onUnmount       : PropTypes.func,
    settings        : PropTypes.object,
    start_epoch     : PropTypes.number,
    symbol          : PropTypes.string,
    wsForget        : PropTypes.func,
    wsSendRequest   : PropTypes.func,
    wsSubscribe     : PropTypes.func,
};

export default connect(
    ({ modules, ui }) => ({
        barriers_array  : modules.smart_chart.barriers_array,
        is_title_enabled: modules.smart_chart.is_title_enabled,
        markers_array   : modules.smart_chart.markers_array,
        onUnmount       : modules.smart_chart.onUnmount,
        settings        : modules.smart_chart.settings,
        wsForget        : modules.smart_chart.wsForget,
        wsSendRequest   : modules.smart_chart.wsSendRequest,
        wsSubscribe     : modules.smart_chart.wsSubscribe,
        is_mobile       : ui.is_mobile,
    })
)(Chart);
