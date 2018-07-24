import PropTypes       from 'prop-types';
import React           from 'react';
import ContractDetails from './contract_details.jsx';
import SmartCharts     from '../../../App/Components/Charts/smartcharts.jsx';
import { connect }     from '../../../Stores/connect';

const Contract = ({
    initial_symbol,
    is_mobile,
    match,
}) => (
    <div className='trade-container'>
        <div className='chart-container notice-msg'>
            { initial_symbol &&
                <SmartCharts
                    initial_symbol={initial_symbol}
                    is_mobile={is_mobile}
                />
            }
        </div>
        <ContractDetails contract_id={match.params.contract_id} />
    </div>
);

Contract.propTypes = {
    initial_symbol: PropTypes.string,
    is_mobile     : PropTypes.bool,
    match         : PropTypes.object,
};

export default connect(
    ({ modules, ui }) => ({
        initial_symbol: modules.contract.contract_info.underlying,
        is_mobile     : ui.is_mobile,
    })
)(Contract);
