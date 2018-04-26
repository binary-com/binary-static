import ContractType from './helpers/contract_type';

export const onChangeContractTypeList = ({ contract_type, contract_types_list }) => (
    ContractType.getContractType(contract_types_list, contract_type)
);

export const onChangeContractType = (store) => (
    ContractType.getContractValues(store)
);
