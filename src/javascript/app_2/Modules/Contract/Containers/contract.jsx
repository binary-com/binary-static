import PropTypes       from 'prop-types';
import React           from 'react';
import ContractDetails from './contract_details.jsx';
import SmartChart      from '../../SmartChart';
import { connect }     from '../../../Stores/connect';

const Contract = ({
    chart_config = {},
    match,
    symbol,
}) => (
    <div className='trade-container'>
        <div className='chart-container notice-msg'>
            { symbol &&
                <SmartChart symbol={symbol} {...chart_config} />
            }
        </div>
        <ContractDetails 
            contract_id={match.params.contract_id}
            key={match.params.contract_id}
        />
    </div>
);

Contract.propTypes = {
    chart_config: PropTypes.object,
    match       : PropTypes.object,
    symbol      : PropTypes.string,
};

export default connect(
    ({ modules }) => ({
        chart_config: modules.contract.chart_config,
        symbol      : modules.contract.contract_info.underlying,
    })
)(Contract);
