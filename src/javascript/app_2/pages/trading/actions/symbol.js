import ContractType from '../actions/helpers/contract_type';

export const onChangeSymbolAsync = async(symbol) => {
    await ContractType.buildContractTypesConfig(symbol);
};
