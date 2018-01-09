import React from 'react';
import Amount from './components/amount.jsx';
import Duration from './components/duration.jsx';
import Logic from './logic/main';

class TradeApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = Logic.getState();
        this.handleChange = this.handleChange.bind(this);
        this.count = 0;
        this.set = (obj) => { this.setState(obj); };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    componentDidMount() {
        Logic.init(this.set);
    }

    render() {
        return (
            <div className='gr-padding-30'>
                <h1>...</h1>
                <div className='gr-row'>
                    <div className='gr-9'>
                        <Duration
                            onChange={this.handleChange}
                            duration={this.state.duration}
                            duration_unit={this.state.duration_unit}
                            expiry_type={this.state.expiry_type}
                        />

                        <Amount
                            onChange={this.handleChange}
                            amount={this.state.amount}
                            basis={this.state.basis}
                            currency={this.state.currency}
                        />

                        <div>{this.state.message || 'Country: ?'}</div>
                        <p>EUR/USD: {this.state.tick || '?'}</p>
                    </div>

                    <div className='gr-3 notice-msg' style={{ fontSize: '10px', lineHeight: '15px' }}>
                        {Object.keys(this.state).map(k => <div key={k}><strong>{k}:</strong> {`${this.state[k]}`}</div>)}
                        <br />
                        {JSON.stringify(this.state).replace(/(:|,)/g, '$1 ')}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = TradeApp;
