import React from 'react';
import Amount from './components/amount.jsx';
import Barrier from './components/barrier.jsx';
import Duration from './components/duration.jsx';
import StartDate from './components/start_date.jsx';
import ContractType from './components/contract_type.jsx';
import LastDigit from './components/last_digit.jsx';
import Symbol from './components/symbol.jsx';
import Test from './components/test.jsx';
import { connect } from './store/connect';

class TradeApp extends React.Component {
    componentDidMount() {
        this.props.onMounted();
    }
    render() {
        return (
            <React.Fragment>
                <div className='chart-container notice-msg'>
                    <Test />
                </div>
                <div className='sidebar-container'>
                    <Symbol />
                    <ContractType />
                    <StartDate />
                    <Duration />
                    <Barrier />
                    <LastDigit />
                    <Amount />
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    ({trade}) => ({
        onMounted: trade.init,
    })
)(TradeApp);
