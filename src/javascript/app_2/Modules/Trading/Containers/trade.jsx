import classnames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import FormLayout      from '../Components/Form/form_layout.jsx';
import Test            from './test.jsx';
import SmartCharts     from '../../../components/charts/smartcharts.jsx';
import PortfolioDrawer from '../../../components/elements/portfolio_drawer.jsx';
import { connect }     from '../../../Stores/connect';

class Trade extends React.Component {
    render() {
        return (
            <div
                id='trade_container'
                className={classnames('trade-container', {
                    show: this.props.is_portfolio_drawer_on,
                })}
            >
                <div className='chart-container notice-msg'>
                    <SmartCharts
                        chart_barriers={this.props.chart_barriers}
                        initial_symbol={this.props.initial_symbol}
                        is_mobile={this.props.is_mobile}
                        onSymbolChange={this.props.onSymbolChange}
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
    is_mobile             : PropTypes.bool,
    is_portfolio_drawer_on: PropTypes.bool,
    is_purchase_enabled   : PropTypes.bool,
    is_trade_enabled      : PropTypes.bool,
    onSymbolChange        : PropTypes.func,
    server_time           : PropTypes.object,
    togglePortfolioDrawer : PropTypes.func,
};

export default connect(
    ({ common, modules, ui }) => ({
        server_time           : common.server_time,
        chart_barriers        : modules.trade.chart_barriers,
        initial_symbol        : modules.trade.symbol,
        is_purchase_enabled   : modules.trade.is_purchase_enabled,
        is_trade_enabled      : modules.trade.is_trade_enabled,
        onSymbolChange        : modules.trade.onChange,
        is_mobile             : ui.is_mobile,
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
        togglePortfolioDrawer : ui.togglePortfolioDrawer,
    })
)(Trade);
