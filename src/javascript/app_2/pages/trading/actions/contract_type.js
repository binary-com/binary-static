import ContractType from './helpers/contract_type';

export const onChangeContractTypeList = ({ contract_type, contract_types_list }) => (
    ContractType.getContractType(contract_types_list, contract_type)
);

export const onChangeContractType = ({ contract_type, contract_expiry_type }) => {
    const obj_contract_type = onContractChange(contract_type);
    const obj_trade_types   = ContractType.getTradeTypes(contract_type);
    const obj_barrier       = ContractType.getBarriers(contract_type, contract_expiry_type);
    const obj_start_dates   = ContractType.getStartDates(contract_type);

    return { ...obj_contract_type, ...obj_barrier, ...obj_trade_types, ...obj_start_dates };
};

const onContractChange = (c_type) => {
    const form_components = ContractType.getComponents(c_type);
    return {
        form_components,
    };
};
