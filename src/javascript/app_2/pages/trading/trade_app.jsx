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

import DataTable, { transactions, statement_columns } from './components/data_table.jsx';

class TradeApp extends React.Component {
    componentDidMount() {
        this.props.onMounted();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    isVisible(component_name) {
        return this.props.form_components.indexOf(component_name) >= 0;
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

                    {this.isVisible('start_date') && <StartDate />}
                    <Duration />
                    {this.isVisible('barrier') && <Barrier />}
                    {this.isVisible('last_digit') && <LastDigit />}
                    <Amount />

                    <Purchase />
                </div>

                <div className='container'>
                    <div className='gr-row gr-padding-20'>
                        <div className='gr-12'>
                            <h2 className='center-text'>Data Table</h2>

                            <DataTable dataSource={transactions} columns={statement_columns} pagination pageSize={6} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    ({trade}) => ({
        form_components: trade.form_components,
        onMounted      : trade.init,
        onUnmount      : trade.dispose,
    })
)(TradeApp);
