import { useStrict, action } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { cloneObject } from '../../../../_common/utility';

// add files containing actions here.
import * as currency from './currency';
import * as duration from './duration';
import * as symbol from './symbol';
import * as test from './test';
import * as contract_type from './contract_type';

useStrict(true);

const arr_actions        = [currency, duration, symbol, test, contract_type];
const reaction_disposers = [];

const defaultExports = { ...arr_actions.reduce((acc, act) => acc.concat(act), []) };

function addToExports(list, store) {
    Object.keys(list).forEach((methodName) => {
        const method = list[methodName];

        if (/.*async$/i.test(methodName)) {
            defaultExports[methodName] = asyncAction(`${methodName}.wrapper`, function* (payload) {
                const snapshot = cloneObject(store);
                const new_state = yield asyncAction(methodName, method)(snapshot, payload);
                Object.keys(new_state).forEach((key) => {
                    store[key] = new_state[key];
                });
            });
        } else {
            defaultExports[methodName] = action(methodName, (payload) => {
                const snapshot = cloneObject(store);
                const new_state = method(snapshot, payload);
                Object.keys(new_state).forEach((key) => {
                    store[key] = new_state[key];
                });
            });
        }
    });
}

export const initActions = (store) => {
    arr_actions.forEach(act => {
        addToExports(act, store);
    });
};

export const storeDisposer = (disposer) => reaction_disposers.push(disposer);

// TODO: call this on unload of trade
export const dispose = () => {
    reaction_disposers.forEach((disposer) => { disposer(); });
};

export const getReactions = () => ({
    symbol             : defaultExports.onSymbolChangeAsync,
    contract_types_list: defaultExports.onChangeContractTypeList,
    contract_type      : defaultExports.onChangeContractType,
    amount             : defaultExports.onAmountChange,
});

export default defaultExports;
