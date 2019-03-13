import PropTypes            from 'prop-types';
import React                from 'react';
import URL                  from '_common/url';
import { getPropertyValue } from '_common/utility';
import FullPageModal        from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize             from 'App/Components/Elements/localize.jsx';
import UILoader             from 'App/Components/Elements/ui-loader.jsx';
import { connect }          from 'Stores/connect';
import Test                 from './test.jsx';
import FormLayout           from '../Components/Form/form-layout.jsx';
import Digits               from '../../Contract/Containers/digits.jsx';
import InfoBox              from '../../Contract/Containers/info-box.jsx';
import { localize }         from '../../../../_common/localize';

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
        const form_wrapper_class = this.props.is_mobile ? 'mobile-wrapper' : 'sidebar__container desktop-only';
        const should_show_last_digit_stats = ['match_diff', 'even_odd', 'over_under'].includes(this.props.contract_type)
            && !this.props.is_contract_mode;

        return (
            <div id='trade_container' className='trade-container'>
                <div className='chart-container'>
                    { this.props.symbol &&
                        <React.Suspense fallback={<UILoader />} >
                            <SmartChart
                                chart_id={this.props.chart_id}
                                Digits={<Digits is_trade_page />}
                                InfoBox={<InfoBox is_trade_page />}
                                onSymbolChange={this.props.onSymbolChange}
                                symbol={this.props.symbol}
                                chart_type={this.props.chart_type}
                                granularity={this.props.granularity}
                                updateChartType={this.props.updateChartType}
                                updateGranularity={this.props.updateGranularity}
                                should_show_last_digit_stats={should_show_last_digit_stats}
                                start_epoch={this.props.start_epoch}
                                end_epoch={this.props.end_epoch}
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
                        is_contract_visible={!!contract_id || this.props.is_contract_mode}
                        is_trade_enabled={this.props.is_trade_enabled}
                    />
                </div>
                <FullPageModal
                    cancel_button_text={localize('Trade on other contracts')}
                    confirm_button_text={localize('Switch to legacy platform')}
                    is_visible={this.props.has_only_forward_starting_contracts}
                    onCancel={() => this.props.setHasOnlyForwardingContracts(false)}
                    onConfirm={() => window.open(URL.websiteUrl())}
                >
                    <Localize str='Sorry, but forward-start contracts are not supported yet on our new platform.' />
                </FullPageModal>
            </div>
        );
    }
}

Trade.propTypes = {
    chart_id                           : PropTypes.number,
    contract_type                      : PropTypes.string,
    end_epoch                          : PropTypes.number,
    has_only_forward_starting_contracts: PropTypes.bool,
    is_contract_mode                   : PropTypes.bool,
    is_mobile                          : PropTypes.bool,
    is_trade_enabled                   : PropTypes.bool,
    onClickNewTrade                    : PropTypes.func,
    onMount                            : PropTypes.func,
    onSymbolChange                     : PropTypes.func,
    onUnmount                          : PropTypes.func,
    purchase_info                      : PropTypes.object,
    setHasOnlyForwardingContracts      : PropTypes.func,
    start_epoch                        : PropTypes.number,
    symbol                             : PropTypes.string,
};

export default connect(
    ({ modules, ui }) => ({
        start_epoch                        : modules.contract.chart_config.start_epoch,
        end_epoch                          : modules.contract.chart_config.end_epoch,
        chart_type                         : modules.smart_chart.chart_type,
        granularity                        : modules.smart_chart.granularity,
        is_contract_mode                   : modules.smart_chart.is_contract_mode,
        updateChartType                    : modules.smart_chart.updateChartType,
        updateGranularity                  : modules.smart_chart.updateGranularity,
        chart_id                           : modules.trade.chart_id,
        contract_type                      : modules.trade.contract_type,
        is_trade_enabled                   : modules.trade.is_trade_enabled,
        onClickNewTrade                    : modules.trade.onClickNewTrade,
        onMount                            : modules.trade.onMount,
        onSymbolChange                     : modules.trade.onChange,
        onUnmount                          : modules.trade.onUnmount,
        purchase_info                      : modules.trade.purchase_info,
        symbol                             : modules.trade.symbol,
        has_only_forward_starting_contracts: ui.has_only_forward_starting_contracts,
        is_mobile                          : ui.is_mobile,
        setHasOnlyForwardingContracts      : ui.setHasOnlyForwardingContracts,
    })
)(Trade);
