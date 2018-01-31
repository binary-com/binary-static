import React from 'react';
import Amount from './components/amount.jsx';
import Barrier from './components/barrier.jsx';
import Duration from './components/duration.jsx';
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
                    <Duration />
                    <Barrier />
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
