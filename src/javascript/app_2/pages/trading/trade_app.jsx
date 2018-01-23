import React from 'react';
import Amount from './components/amount.jsx';
import Duration from './components/duration.jsx';
import { connect } from './store/connect';

class TradeApp extends React.Component {
    handleChange() {
        console.warn(this.props, 'ToDo');
    }

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
                        <div>{this.props.message}</div>
                        <p>EUR/USD: {this.props.tick}</p>
                    </div>

                    <div className='gr-3 notice-msg' style={{ fontSize: '10px', lineHeight: '15px' }}>
                        {this.props.entries.map(([k, v]) => <div key={k}><strong>{k}:</strong> {v}</div>)}
                        <br />
                        {this.props.json}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    ({trade}) => ({
        message  : trade.message || 'Country: ?',
        tick     : trade.tick || '?',
        entries  : Object.entries(trade),
        json     : JSON.stringify(trade).replace(/(:|,)/g, '$1 '),
        onMounted: trade.init,
    })
)(TradeApp);
