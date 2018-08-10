import PropTypes       from 'prop-types';
import React           from 'react';
import ContractDetails from './contract_details.jsx';
import InfoBox         from '../Components/InfoBox';
import SmartChart      from '../../SmartChart';
import { connect }     from '../../../Stores/connect';

const Contract = ({
    chart_config = {},
    contract_info,
    match,
    symbol,
}) => (
    <div className='trade-container'>
        <div className='chart-container notice-msg'>
            { symbol &&
                <SmartChart
                    InfoBox={<InfoBox contract_info={contract_info} />}
                    symbol={symbol}
                    {...chart_config}
                />
            }
        </div>
        <ContractDetails contract_id={match.params.contract_id} />
    </div>
);

Contract.propTypes = {
    chart_config : PropTypes.object,
    contract_info: PropTypes.object,
    match        : PropTypes.object,
    symbol       : PropTypes.string,
};

export default connect(
    ({ modules }) => ({
        chart_config : modules.contract.chart_config,
        contract_info: modules.contract.contract_info,
        symbol       : modules.contract.contract_info.underlying,
    })
)(Contract);
