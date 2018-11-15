import extend             from 'extend';
import { isEmptyObject }  from '_common/utility';
import ContractTypeHelper from './contract_type';

import * as ContractType  from '../Actions/contract_type';
import * as Currency      from '../Actions/currency';
import * as Duration      from '../Actions/duration';
import * as StartDate     from '../Actions/start_date';

export const processTradeParams = async(store, new_state) => {
    const snapshot = store.getSnapshot();

    if (!store.root_store.client.currency && isEmptyObject(store.currencies_list)) {
        extendOrReplace(snapshot, await Currency.getCurrenciesAsync(store.currency));
    }

    getMethodsList(store, new_state).forEach((fnc) => {
        extendOrReplace(snapshot, fnc(snapshot));
    });

    return snapshot;
};

const getMethodsList = (store, new_state) => ([
    ContractTypeHelper.getContractCategories,
    ContractType.onChangeContractTypeList,
    ...(/\b(symbol|contract_type)\b/.test(Object.keys(new_state)) || !store.contract_type ? // symbol/contract_type changed or contract_type not set yet
        [ContractType.onChangeContractType] : []),
    Duration.onChangeExpiry,
    StartDate.onChangeStartDate,
]);

// Some values need to be replaced, not extended
const extendOrReplace = (source, new_values) => {
    const to_replace = ['contract_types_list', 'duration_units_list', 'form_components', 'trade_types'];

    to_replace.forEach((key) => {
        if (key in new_values) {
            source[key] = undefined;
        }
    });

    extend(true, source, new_values);
};
