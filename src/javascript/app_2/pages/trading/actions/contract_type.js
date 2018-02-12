import ContractType from '../store/logic/contract_type';

export const onChangeContractTypeList = (store) => (
    ContractType.getContractType(store.contract_types_list, store.contract_type)
);

export const onChangeContractType = (store) => {
    const obj_contract_type = ContractType.onContractChange(store.contract_type);
    const obj_trade_types   = ContractType.getTradeTypes(store);
    const contract_info     = ContractType.getContractInfoValues(['barrier', 'high_barrier', 'low_barrier'], store);

    const obj_barrier = {
        barrier_1: contract_info.barrier || contract_info.high_barrier || '',
        barrier_2: contract_info.low_barrier || '',
    };

    return { ...obj_contract_type, ...obj_barrier, ...obj_trade_types };
};
