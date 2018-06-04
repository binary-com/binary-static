import ContractType from '../actions/helpers/contract_type';
import { getActiveSymbols } from '../../../data/dao';

export const getActiveSymbolAsync = function *() {
    const active_symbols = yield getActiveSymbols();
    return {
        active_symbols,
    };
};

export const onChangeSymbolAsync = async(symbol) => {
    await ContractType.buildContractTypesConfig(symbol);
};
