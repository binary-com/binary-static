import getBarrierValues from './logic/barrier';
import ContractType from './logic/contract_type';

const Reactions = (() => {
    const reaction_disposers = [];

    const onChangeContractTypeList = (new_list, store) => ContractType.getContractType(new_list, store.contract_type);

    const onChangeContractType = (new_type, store) => {
        const obj_contract_type = ContractType.onContractChange(new_type);
        const obj_barrier       = getBarrierValues(ContractType.getContractInfoValues(['barrier', 'high_barrier', 'low_barrier'], store));
        const obj_trade_types   = ContractType.getTradeTypes(store);
        return $.extend(obj_contract_type, obj_barrier, obj_trade_types);
    };

    const reaction_map = {
        contract_types_list: onChangeContractTypeList,
        contract_type      : onChangeContractType,
    };

    // TODO: call this on unload of trade
    const dispose = () => {
        reaction_disposers.forEach((disposer) => { disposer(); });
    };

    return {
        dispose,
        getReactions : () => reaction_map,
        storeDisposer: (disposer) => reaction_disposers.push(disposer),
    };
})();

export default Reactions;
