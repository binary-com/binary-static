import PropTypes       from 'prop-types';
import React           from 'react';
import ContractDetails from './contract_details.jsx';
import SmartChart      from '../../SmartChart';
import { connect }     from '../../../Stores/connect';

const Contract = ({
    initial_symbol,
    match,
}) => (
    <div className='trade-container'>
        <div className='chart-container notice-msg'>
            { initial_symbol &&
                <SmartChart
                    initial_symbol={initial_symbol}
                />
            }
        </div>
        <ContractDetails contract_id={match.params.contract_id} />
    </div>
);

Contract.propTypes = {
    initial_symbol: PropTypes.string,
    match         : PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        initial_symbol: modules.contract.contract_info.underlying,
    })
)(Contract);
