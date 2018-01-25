import React from 'react';
import Amount from './components/amount.jsx';
import Duration from './components/duration.jsx';
import Test from './components/test.jsx';
import { connect } from './store/connect';

class TradeApp extends React.Component {
    componentDidMount() {
        this.props.onMounted();
    }

    render() {
        return (
            <div className='gr-padding-30'>
                <h1>...</h1>
                <div className='gr-row'>
                    <div className='gr-9'>
                        <Duration />
                        <Amount />
                    </div>

                    <div className='gr-3 notice-msg'>
                        <Test />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    ({trade}) => ({
        onMounted: trade.init,
    })
)(TradeApp);
