import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import Test            from './test.jsx';
import FormLayout      from '../Components/Form/form_layout.jsx';
import SmartCharts     from '../../../App/Components/Charts/smartcharts.jsx';
import PortfolioDrawer from '../../../App/Components/Elements/portfolio_drawer.jsx';
import { connect }     from '../../../Stores/connect';

class Trade extends React.Component {
    render() {
        return (
            <div
                id='trade_container'
                className={classNames('trade-container', {
                    show: this.props.is_portfolio_drawer_on,
                })}
            >
                <div className='chart-container notice-msg'>
                    <SmartCharts
                        chart_barriers={this.props.chart_barriers}
                        initial_symbol={this.props.initial_symbol}
                        is_mobile={this.props.is_mobile}
                        onSymbolChange={this.props.onSymbolChange}
                        is_dark_theme={this.props.is_dark_theme}
                        is_asset_enabled={this.props.is_asset_enabled}
                        is_countdown_enabled={this.props.is_countdown_enabled}
                        is_position_default={this.props.is_position_default}
                    />
                    <Test />
                </div>
                <FormLayout is_mobile={this.props.is_mobile} is_trade_enabled={this.props.is_trade_enabled} />
                {/* TODO: to move PortfolioDrawer to an upper parent, as it should be available in all pages */}
                <PortfolioDrawer />
            </div>
        );
    }
}

Trade.propTypes = {
    chart_barriers        : PropTypes.object,
    initial_symbol        : PropTypes.string,
    is_asset_enabled      : PropTypes.bool,
    is_countdown_enabled  : PropTypes.bool,
    is_dark_theme         : PropTypes.bool,
    is_position_default   : PropTypes.bool,
    is_mobile             : PropTypes.bool,
    is_portfolio_drawer_on: PropTypes.bool,
    is_purchase_enabled   : PropTypes.bool,
    is_trade_enabled      : PropTypes.bool,
    onSymbolChange        : PropTypes.func,
    server_time           : PropTypes.object,
};

export default connect(
    ({ common, modules, ui }) => ({
        server_time           : common.server_time,
        chart_barriers        : modules.trade.chart_barriers,
        initial_symbol        : modules.trade.symbol,
        is_dark_theme         : ui.is_dark_mode_on,
        is_countdown_enabled  : ui.is_chart_countdown_visible,
        is_asset_enabled      : ui.is_chart_asset_info_visible,
        is_position_default   : ui.is_chart_layout_default,
        is_purchase_enabled   : modules.trade.is_purchase_enabled,
        is_trade_enabled      : modules.trade.is_trade_enabled,
        onSymbolChange        : modules.trade.onChange,
        is_mobile             : ui.is_mobile,
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
    })
)(Trade);
