import ContractType from '../actions/helpers/contract_type';

export const onChangeSymbolAsync = function *(store) {
    return yield ContractType.buildContractTypesConfig(store);
};
