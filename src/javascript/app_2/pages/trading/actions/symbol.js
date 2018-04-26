import ContractType from '../actions/helpers/contract_type';
import { getTicks } from './test';

export const onChangeSymbolAsync = function *(store) {
    yield ContractType.buildContractTypesConfig(store.symbol);

    getTicks({ symbol: store.symbol }, () => {});

    const contract_types_list = ContractType.getContractCategories();
    const new_contract_type   = ContractType.getContractType(contract_types_list, store.contract_type).contract_type;

    // always return the new contract type list
    // if contract type hasn't changed, update any contract values that might have changed.
    // if contract type has changed, let onChangeContractType handle updating values
    return {
        contract_types_list,
        ...(
            new_contract_type === store.contract_type &&
            ContractType.getContractValues(store)
        ),
    };
};
