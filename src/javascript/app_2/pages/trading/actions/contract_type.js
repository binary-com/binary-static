import ContractType from './helpers/contract_type';

export const onChangeContractTypeList = (store) => (
    ContractType.getContractType(store.contract_types_list, store.proposal.contract_type)
);

export const onChangeContractType = (store) => (
    ContractType.getContractValues(store)
);
