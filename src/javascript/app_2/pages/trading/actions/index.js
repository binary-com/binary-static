import extend                             from 'extend';
import { runInAction }                    from 'mobx';
import URLHelper                          from '../../../common/url_helper';
import Client                             from '../../../../_common/base/client_base';
import { cloneObject, isEmptyObject }     from '../../../../_common/utility';

import ContractTypeHelper                 from './helpers/contract_type';
import { requestProposal }                from './helpers/proposal';
import { allowed_query_string_variables } from './helpers/query_string';

// add files containing actions here.
import * as ContractType                  from './contract_type';
import * as Currency                      from './currency';
import * as Duration                      from './duration';
import * as StartDate                     from './start_date';
import * as Symbol                        from './symbol';


export const updateStore = async(store, obj_new_values = {}, is_by_user) => {
    const new_state = cloneObject(obj_new_values);
    runInAction(() => {
        Object.keys(new_state).forEach((key) => {
            if (key === 'main_store') return;
            if (JSON.stringify(store[key]) === JSON.stringify(new_state[key])) {
                delete new_state[key];
            } else {
                if (key === 'symbol') {
                    store.is_purchase_enabled = false;
                    store.is_trade_enabled    = false;
                }

                // Add changes to queryString of the url
                if (allowed_query_string_variables.indexOf(key) !== -1) {
                    URLHelper.setQueryParam({ [key]: new_state[key] });
                }

                store[key] = new_state[key];
            }
        });
    });

    if (is_by_user || /\b(symbol|contract_types_list)\b/.test(Object.keys(new_state))) {
        if ('symbol' in new_state) {
            await Symbol.onChangeSymbolAsync(new_state.symbol);
        }
        process(store, new_state);
    }
};

const process = async(store, new_state) => {
    updateStore(store, { // disable purchase button(s), clear contract info, cleanup chart
        is_purchase_enabled: false,
        proposal_info      : {},
        chart_barriers     : {},
    });

    const snapshot = cloneObject(store);

    if (!Client.get('currency') && isEmptyObject(store.currencies_list)) {
        extendOrReplace(snapshot, await Currency.getCurrenciesAsync(store.currency));
    }

    getMethodsList(store, new_state).forEach((fnc) => {
        extendOrReplace(snapshot, fnc(snapshot));
    });

    snapshot.is_trade_enabled = true;
    updateStore(store, snapshot);

    requestProposal(store, updateStore);
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
    const to_replace = ['contract_types_list', 'trade_types'];

    to_replace.forEach((key) => {
        if (key in new_values) {
            source[key] = undefined;
        }
    });

    extend(true, source, new_values);
};
