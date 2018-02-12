import { useStrict, action, reaction } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { cloneObject } from '../../../../_common/utility';

// add files containing actions here.
import * as currency from './currency';
import * as duration from './duration';
import * as symbol from './symbol';
import * as test from './test';
import * as contract_type from './contract_type';

useStrict(true);

const reaction_disposers = [];

const defaultExports = { ...currency, ...duration, ...symbol, ...contract_type, ...test };

export const initActions = (store) => {
    Object.keys(defaultExports).forEach((methodName) => {
        const method = defaultExports[methodName];

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

    const reaction_map   = {
        symbol             : defaultExports.onSymbolChangeAsync,
        contract_types_list: defaultExports.onChangeContractTypeList,
        contract_type      : defaultExports.onChangeContractType,
        amount             : defaultExports.onAmountChange,
    };

    Object.keys(reaction_map).forEach((reaction_key) => {
        const disposer = reaction(() => store[reaction_key], reaction_map[reaction_key]);
        reaction_disposers.push(disposer);
    });
};

// TODO: call this on unload of trade
export const disposeActions = () => {
    reaction_disposers.forEach((disposer) => { disposer(); });
};

export default defaultExports;
