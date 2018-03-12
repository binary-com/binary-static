import React from 'react';
import Amount from './components/amount.jsx';
import Barrier from './components/barrier.jsx';
import ContractType from './components/contract_type.jsx';
import Duration from './components/duration.jsx';
import LastDigit from './components/last_digit.jsx';
import StartDate from './components/start_date.jsx';
import Symbol from './components/symbol.jsx';
import Test from './components/test.jsx';
import Purchase from './components/purchase.jsx';
import { connect } from './store/connect';
import PortfolioDrawer from './components/elements/portfolio_drawer.jsx';

class TradeApp extends React.Component {
    isVisible(component_name) {
        return this.props.form_components.indexOf(component_name) >= 0;
    }

    render() {
        return (
            <div id='trade_container' className={this.props.is_portfolio_drawer_on ? 'show' : undefined}>
                <div className='chart-container notice-msg'>
                    <Symbol />
                    <ContractType />
                    <Test />
                </div>
                <div className='sidebar-container desktop-only'>

                    {this.isVisible('start_date') && <StartDate />}
                    <Duration />
                    {this.isVisible('barrier') && <Barrier />}
                    {this.isVisible('last_digit') && <LastDigit />}
                    <Amount />

                    <Purchase />
                </div>

                <div className='offset-container'>
                    <PortfolioDrawer
                        onClick={this.props.togglePortfolioDrawer}
                        portfolios={this.props.portfolios}
                    />
                </div>
            </div>
        );
    }
}

export default connect(
    ({ trade, ui }) => ({
        form_components       : trade.form_components,
        portfolios            : trade.portfolios,
        is_portfolio_drawer_on: ui.is_portfolio_drawer_on,
        togglePortfolioDrawer : ui.togglePortfolioDrawer,
    })
)(TradeApp);
