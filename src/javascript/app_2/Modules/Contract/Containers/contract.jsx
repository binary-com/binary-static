import PropTypes       from 'prop-types';
import React           from 'react';
import ContractDetails from './contract_details.jsx';
import SmartChart      from '../../SmartChart';
import { connect }     from '../../../Stores/connect';

const Contract = ({
    symbol,
    match,
}) => (
    <div className='trade-container'>
        <div className='chart-container notice-msg'>
            { symbol &&
                <SmartChart symbol={symbol} />
            }
        </div>
        <ContractDetails contract_id={match.params.contract_id} />
    </div>
);

Contract.propTypes = {
    symbol: PropTypes.string,
    match : PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        symbol: modules.contract.contract_info.underlying,
    })
)(Contract);
