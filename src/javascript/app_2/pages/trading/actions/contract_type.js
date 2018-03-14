import ContractType from '../store/logic/contract_type';

export const onChangeContractTypeList = (store) => (
    ContractType.getContractType(store.contract_types_list, store.contract_type)
);

export const onChangeContractType = (store) => {
    const obj_contract_type = ContractType.onContractChange(store.contract_type);
    const obj_trade_types   = ContractType.getTradeTypes(store);
    const obj_barrier       = ContractType.getBarriers(store);
    const obj_start_dates   = ContractType.getStartDates(store);

    return { ...obj_contract_type, ...obj_barrier, ...obj_trade_types, ...obj_start_dates };
};
