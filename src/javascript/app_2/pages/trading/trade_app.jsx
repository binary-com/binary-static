import React from 'react';
import Amount from './components/amount.jsx';
import Duration from './components/duration.jsx';
import { MdcButton } from './components/form/buttons.jsx';
import { connect } from './store/connect';

const TestBtn = (e) => {
    e.preventDefault();
    console.log('test');
};

class TradeApp extends React.Component {
    handleChange() {
        console.warn(this.props, 'ToDo');
    }

    componentDidMount() {
        this.props.onMounted();
    }

    render() {
        return (
            <div className='trade-container'>
                <div className='gr-padding-30'>
                    <div className='gr-row'>
                        <div className='gr-9 notice-msg shadow-1' style={{ fontSize: '10px', lineHeight: '15px' }}>
                            {this.props.entries.map(([k, v]) => <div key={k}><strong>{k}:</strong> {v}</div>)}
                            <br />
                            {this.props.json}
                        </div>
                        <div className='gr-3'>
                            <Duration />
                            <Amount />
                            <div className='gr-padding-20'>
                                <div className='gr-row'>
                                    <div className='gr-6'>
                                        <MdcButton
                                            id ='test_btn'
                                            className = 'shadow-1'
                                            text='Test'
                                            textColor='white'
                                            font_size='24px'
                                            bgColor='green'
                                            handleClick={TestBtn}
                                            is_ripple
                                        />
                                    </div>
                                    <div className='gr-6'>
                                        <MdcButton
                                            id ='test_btn'
                                            className = 'shadow-1'
                                            text='Test'
                                            textColor='white'
                                            font_size='24px'
                                            bgColor='blue'
                                            handleClick={TestBtn}
                                            is_ripple
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>{this.props.message}</div>
                            <p>EUR/USD: {this.props.tick}</p>
                        </div>
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
