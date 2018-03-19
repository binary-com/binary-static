import ContractType from '../actions/helpers/contract_type';

export const onChangeSymbolAsync = function *({ symbol, contract_type, contract_expiry_type }) {
    yield ContractType.buildContractTypesConfig(symbol);

    const contract_types_list = ContractType.getContractCategories();
    const new_contract_type   = ContractType.getContractType(contract_types_list, contract_type).contract_type;

    // always return the new contract type list
    // if contract type hasn't changed, update any contract values that might have changed.
    // if contract type has changed, let onChangeContractType handle updating values
    return {
        contract_types_list,
        ...(
            new_contract_type === contract_type && ContractType.getContractValues(contract_type, contract_expiry_type)
        ),
    };
};
