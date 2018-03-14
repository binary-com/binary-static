import ContractType from '../actions/helpers/contract_type';

export const onChangeSymbolAsync = function *({symbol}) {
    yield ContractType.buildContractTypesConfig(symbol);
    const r = ContractType.getContractCategories();
    return {
        contract_types_list: r,
    };
};
