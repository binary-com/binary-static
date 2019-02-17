import PropTypes            from 'prop-types';
import React                from 'react';
import { CSSTransition }    from 'react-transition-group';
import { getPropertyValue } from '_common/utility';
import UILoader             from 'App/Components/Elements/ui_loader.jsx';
import { connect }          from 'Stores/connect';
import Test                 from './test.jsx';
import FormLayout           from '../Components/Form/form_layout.jsx';
import ContractDetails      from '../../Contract/Containers/contract_details.jsx';
import InfoBox              from '../../Contract/Containers/info_box.jsx';

const SmartChart = React.lazy(() => import(/* webpackChunkName: "smart_chart" */'../../SmartChart'));

class Trade extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const contract_id = getPropertyValue(this.props.purchase_info, ['buy', 'contract_id']);
        const form_wrapper_class = this.props.is_mobile ? 'mobile-wrapper' : 'sidebar-container desktop-only';

        return (
            <div id='trade_container' className='trade-container'>
                <div className='chart-container'>
                    { this.props.symbol &&
                        <React.Suspense fallback={<UILoader />} >
                            <SmartChart
                                chart_id={this.props.chart_id}
                                InfoBox={<InfoBox is_trade_page />}
                                onSymbolChange={this.props.onSymbolChange}
                                symbol={this.props.symbol}
                                chart_type={this.props.chart_type}
                                granularity={this.props.granularity}
                                updateChartType={this.props.updateChartType}
                                updateGranularity={this.props.updateGranularity}
                            />
                        </React.Suspense>
                    }
                    <Test />
                </div>
                <div
                    className={form_wrapper_class}
                >
                    <FormLayout
                        is_mobile={this.props.is_mobile}
                        is_contract_visible={!!contract_id}
                        is_trade_enabled={this.props.is_trade_enabled}
                    />
                    <CSSTransition
                        in={!!contract_id}
                        timeout={400}
                        classNames='contract-wrapper'
                        unmountOnExit
                    >
                        <div className='contract-wrapper'>
                            <ContractDetails
                                contract_id={contract_id}
                                onClickNewTrade={this.props.onClickNewTrade}
                            />
                        </div>
                    </CSSTransition>
                </div>
            </div>
        );
    }
}

Trade.propTypes = {
    chart_id        : PropTypes.number,
    is_contract_mode: PropTypes.bool,
    is_mobile       : PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
    onClickNewTrade : PropTypes.func,
    onMount         : PropTypes.func,
    onSymbolChange  : PropTypes.func,
    onUnmount       : PropTypes.func,
    purchase_info   : PropTypes.object,
    symbol          : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        chart_type       : modules.smart_chart.chart_type,
        granularity      : modules.smart_chart.granularity,
        is_contract_mode : modules.smart_chart.is_contract_mode,
        updateChartType  : modules.smart_chart.updateChartType,
        updateGranularity: modules.smart_chart.updateGranularity,
        chart_id         : modules.trade.chart_id,
        is_trade_enabled : modules.trade.is_trade_enabled,
        onClickNewTrade  : modules.trade.onClickNewTrade,
        onMount          : modules.trade.onMount,
        onSymbolChange   : modules.trade.onChange,
        onUnmount        : modules.trade.onUnmount,
        purchase_info    : modules.trade.purchase_info,
        symbol           : modules.trade.symbol,
        is_mobile        : ui.is_mobile,
    })
)(Trade);
