import { useStrict, action, reaction } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { cloneObject } from '../../../../_common/utility';

// add files containing actions here.
import * as ContractType from './contract_type';
import * as Currency from './currency';
import * as Duration from './duration';
import * as StartDate from './start_date';
import * as Symbol from './symbol';
import * as Test from './test';

useStrict(true);

const reaction_disposers = [];

const defaultExports = { ...ContractType, ...Currency, ...Duration, ...Symbol, ...StartDate, ...Test };

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
        symbol             : defaultExports.onChangeSymbolAsync,
        contract_types_list: defaultExports.onChangeContractTypeList,
        contract_type      : defaultExports.onChangeContractType,
        amount             : defaultExports.onChangeAmount,
    };

    Object.keys(reaction_map).forEach((reaction_key) => {
        const disposer = reaction(() => store[reaction_key], reaction_map[reaction_key]);
        reaction_disposers.push(disposer);
    });
};

export const disposeActions = () => {
    reaction_disposers.forEach((disposer) => { disposer(); });
};

export default defaultExports;
