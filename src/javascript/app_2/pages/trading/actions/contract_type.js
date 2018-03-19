import ContractType from './helpers/contract_type';

export const onChangeContractTypeList = ({ contract_type, contract_types_list }) => (
    ContractType.getContractType(contract_types_list, contract_type)
);

export const onChangeContractType = ({ contract_type, contract_expiry_type, duration_unit }) => (
    ContractType.getContractValues(contract_type, contract_expiry_type, duration_unit)
);
