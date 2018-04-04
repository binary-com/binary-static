import React from 'react';
import { connect } from '../../../store/connect';
import ContractsPopUp from './elements/contracts_popup.jsx';

const Contract = ({
    contract_type,
    contract_types_list,
    onChange,
    ...other
}) => (
    <ContractsPopUp
        name='contract_type'
        list={contract_types_list}
        value={contract_type}
        onChange={onChange}
        {...other}
    />
);

export default connect(
    ({trade}) => ({
        contract_type      : trade.contract_type,
        contract_types_list: trade.contract_types_list,
        onChange           : trade.handleChange,
    })
)(Contract);
