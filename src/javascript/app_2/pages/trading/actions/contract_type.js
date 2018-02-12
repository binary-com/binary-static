import ContractType from '../store/logic/contract_type';
import getBarrierValues from '../store/logic/barrier';

export const onChangeContractTypeList = (store) => (
    ContractType.getContractType(store.contract_types_list, store.contract_type)
);

export const onChangeContractType = (store) => {
    const obj_contract_type = ContractType.onContractChange(store.contract_type);
    const obj_barrier       = getBarrierValues(ContractType.getContractInfoValues(['barrier', 'high_barrier', 'low_barrier'], store));
    const obj_trade_types   = ContractType.getTradeTypes(store);
    return $.extend(obj_contract_type, obj_barrier, obj_trade_types);
};
