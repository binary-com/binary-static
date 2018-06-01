import extend          from 'extend';
import { runInAction } from 'mobx';
import Client          from '../../../../_common/base/client_base';
import {
    cloneObject,
    isEmptyObject }    from '../../../../_common/utility';

import ContractTypeHelper  from './helpers/contract_type';
import { requestProposal } from './helpers/proposal';

// add files containing actions here.
import * as ContractType  from './contract_type';
import * as Currency      from './currency';
import * as Duration      from './duration';
import * as StartDate     from './start_date';
import * as Symbol        from './symbol';

export const updateStore = async(store, obj_new_values = {}, is_by_user) => {
    runInAction(() => {
        const new_state = cloneObject(obj_new_values);
        Object.keys(new_state).forEach((key) => {
            const source = key in store ? store : store.proposal;
            if (JSON.stringify(source[key]) === JSON.stringify(new_state[key])) {
                delete new_state[key];
            } else {
                source[key] = new_state[key];
            }
        });
    });

    if (is_by_user || /^(symbol|contract_types_list)$/.test(Object.keys(obj_new_values))) {
        if ('symbol' in obj_new_values) {
            await Symbol.onChangeSymbolAsync(obj_new_values.symbol);
        }
        process(store);
    }
};

const process = async(store) => {
    const methods = [
        ContractTypeHelper.getContractCategories,
        ContractType.onChangeContractTypeList,
        ContractType.onChangeContractType,
        Duration.onChangeExpiry,
        StartDate.onChangeStartDate,
    ];

    const snapshot = cloneObject(store);

    if (!Client.get('currency') && isEmptyObject(store.currencies_list)) {
        extendOrReplace(snapshot, await Currency.getCurrenciesAsync(store.proposal.currency));
    }

    methods.forEach((fnc) => {
        extendOrReplace(snapshot, fnc(snapshot));
    });

    updateStore(store, snapshot);

    requestProposal(store, updateStore);
};

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
