import ContractType from '../Helpers/contract_type';

export const onChangeSymbolAsync = async(symbol) => {
    await ContractType.buildContractTypesConfig(symbol);
};
