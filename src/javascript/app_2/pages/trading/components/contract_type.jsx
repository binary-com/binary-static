import React          from 'react';
import ContractsPopUp from './elements/contracts_popup.jsx';
import { connect }    from '../../../store/connect';

const Contract = ({
    contract_type,
    contract_types_list,
    onChange,
}) => (
    <ContractsPopUp
        name='contract_type'
        list={contract_types_list}
        value={contract_type}
        onChange={onChange}
    />
);

export default connect(
    ({trade}) => ({
        contract_type      : trade.contract_type,
        contract_types_list: trade.contract_types_list,
        onChange           : trade.handleChange,
    })
)(Contract);
