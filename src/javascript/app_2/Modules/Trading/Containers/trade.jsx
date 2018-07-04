import classnames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import FormLayout                     from '../Components/Form/form_layout.jsx';
import Test                           from '../Components/test.jsx';
import SmartCharts                    from '../../../components/charts/smartcharts.jsx';
import PortfolioDrawer                from '../../../components/elements/portfolio_drawer.jsx';
import { connect }                    from '../../../Stores/connect';

class Trade extends React.PureComponent {
    render() {
        return (
            <div
                id='trade_container'
                className={classnames('trade-container', {
                    show: this.props.is_portfolio_drawer_on,
                })}
            >
                <div className='chart-container notice-msg'>
                    <SmartCharts />
                    <Test />
                </div>
                <FormLayout is_mobile={this.props.is_mobile} is_trade_enabled={this.props.is_trade_enabled} />
                <div className='offset-container'>
                    <PortfolioDrawer
                        onClick={this.props.togglePortfolioDrawer}
                        portfolios={this.props.portfolios}
                        server_time={this.props.server_time}
                    />
                </div>
            </div>
        );
    }
}

Trade.propTypes = {
    is_mobile             : PropTypes.bool,
    is_portfolio_drawer_on: PropTypes.bool,
    is_purchase_enabled   : PropTypes.bool,
    is_trade_enabled      : PropTypes.bool,
    portfolios            : MobxPropTypes.arrayOrObservableArray,
    server_time           : PropTypes.object,
    togglePortfolioDrawer : PropTypes.func,
};

export default connect(
    ({ common, modules, ui }) => ({
        server_time           : common.server_time,
        is_purchase_enabled   : modules.trade.is_purchase_enabled,
        is_trade_enabled      : modules.trade.is_trade_enabled,
        portfolios            : modules.trade.portfolios,
        is_mobile             : ui.is_mobile,
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
        togglePortfolioDrawer : ui.togglePortfolioDrawer,
    })
)(Trade);
