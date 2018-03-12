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

class TradeApp extends React.Component {
    isVisible(component_name) {
        return this.props.form_components.indexOf(component_name) >= 0;
    }

    renderParameters() {
        return (
            <React.Fragment>
                {this.isVisible('start_date') && <StartDate />}
                <Duration />
                {this.isVisible('barrier') && <Barrier />}
                {this.isVisible('last_digit') && <LastDigit />}
                <Amount />
            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                <div className='chart-container notice-msg'>
                    <Symbol />
                    <ContractType />
                    <Test />
                </div>
                <div className='sidebar-container'>
                    <div className='gr-hide-m'>
                        {this.renderParameters()}
                    </div>

                    <div className='gr-hide gr-show-m'>
                        <MobileWidget>
                            {this.renderParameters()}
                        </MobileWidget>
                    </div>
    
                    <Purchase />
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    ({trade}) => ({
        form_components: trade.form_components,
    })
)(TradeApp);
