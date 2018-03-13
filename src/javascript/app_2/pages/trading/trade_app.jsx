import React from 'react';
import Amount from './components/amount.jsx';
import Barrier from './components/barrier.jsx';
import ContractType from './components/contract_type.jsx';
import Duration from './components/duration.jsx';
import LastDigit from './components/last_digit.jsx';
import MobileWidget from './components/elements/mobile_widget.jsx';
import StartDate from './components/start_date.jsx';
import Symbol from './components/symbol.jsx';
import Test from './components/test.jsx';
import Purchase from './components/purchase.jsx';
import { connect } from './store/connect';
import PortfolioDrawer from './components/elements/portfolio_drawer.jsx';

class TradeApp extends React.Component {
    isVisible(component_name) {
        if (['duration', 'amount'].includes(component_name)) return true;
        return this.props.form_components.indexOf(component_name) >= 0;
    }

    renderParamPickers() {
        // TODO: there must be a better way
        const code_to_component = {
            start_date: <StartDate key='start_date' />,
            duration: <Duration key='duration' />,
            barrier: <Barrier key='barrier' />,
            last_digit: <LastDigit key='last_digit' />,
            amount: <Amount key='amount' />,
        };

        return Object.keys(code_to_component)
            .filter(this.isVisible.bind(this))
            .map(code => code_to_component[code]);
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
                    {this.renderParamPickers()}
                    <Purchase />
                </div>

                <div className='mobile-only'>
                    <MobileWidget>
                        {this.renderParamPickers()}
                        <input type='date' />
                        <input type='time' />
                        {this.renderParamPickers()}
                    </MobileWidget>
                </div>

                <div className='offset-container'>
                    <PortfolioDrawer
                        onClick={this.props.togglePortfolioDrawer}
                        portfolios={this.props.portfolios} />
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
