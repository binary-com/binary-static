import ContractType from './helpers/contract_type';

export const onChangeContractTypeList = ({ proposal, contract_types_list }) => (
    ContractType.getContractType(contract_types_list, proposal.contract_type)
);

export const onChangeContractType = (store) => (
    ContractType.getContractValues(store)
);
