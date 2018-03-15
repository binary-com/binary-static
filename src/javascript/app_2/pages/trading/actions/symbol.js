import ContractType from '../actions/helpers/contract_type';

export const onChangeSymbolAsync = function *({ symbol }) {
    yield ContractType.buildContractTypesConfig(symbol);
    const contract_types_list = ContractType.getContractCategories();
    return { contract_types_list };
};
