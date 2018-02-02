import React from 'react';
import Amount from './components/amount.jsx';
import Barrier from './components/barrier.jsx';
import Duration from './components/duration.jsx';
import StartDate from './components/start_date.jsx';
import ContractType from './components/contract_type.jsx';
import { Button } from './components/form/button.jsx';
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
                        <ContractType />
                        <StartDate />
                        <Duration />
                        <Barrier />
                        <Amount />
                        <div className='gr-row'>
                            <div className='gr-3'>
                                <Button
                                    id='test_btn'
                                    className='primary orange'
                                    text='primary'
                                    has_effect
                                />
                                <Button
                                    id ='test_btn'
                                    className='primary green'
                                    text='primary'
                                    has_effect
                                />
                                <Button
                                    id ='test_btn'
                                    className='primary green'
                                    text='primary'
                                    has_effect
                                    is_disabled
                                />
                            </div>
                            <div className='gr-3'>
                                <Button
                                    id ='test_btn'
                                    className='secondary orange'
                                    text='secondary'
                                    has_effect
                                />
                                <Button
                                    id='test_btn'
                                    className='secondary green'
                                    text='secondary'
                                    has_effect
                                />
                                <Button
                                    id='test_btn'
                                    className='secondary green'
                                    text='secondary'
                                    has_effect
                                    is_disabled
                                />
                            </div>
                            <div className='gr-12 gr-centered'>
                                <Button
                                    id='test_btn'
                                    className='flat'
                                    text='is used in a card'
                                    has_effect
                                />
                            </div>
                        </div>
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
