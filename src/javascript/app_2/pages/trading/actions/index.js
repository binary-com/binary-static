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

const defaultExports = { ...ContractType, ...Currency, ...Duration, ...Symbol, ...Test, ...StartDate };

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

    const combine = asyncAction('symbol.wrapper', function* () {
        const snapshot = cloneObject(store);

        Object.assign(snapshot, yield asyncAction('symbol', Symbol.onChangeSymbolAsync)(snapshot));
        Object.assign(snapshot, ContractType.onChangeContractTypeList(snapshot));
        Object.assign(snapshot, ContractType.onChangeContractType(snapshot));

        Object.keys(snapshot).forEach((key) => {
            store[key] = snapshot[key];
        });
    });

    const reaction_map = {
        symbol             : combine,
        contract_types_list: defaultExports.onChangeContractTypeList,
        contract_type      : defaultExports.onChangeContractType,
        amount             : defaultExports.onChangeAmount,
        expiry_type        : defaultExports.onChangeExpiry,
        expiry_date        : defaultExports.onChangeExpiry,
        expiry_time        : defaultExports.onChangeExpiry,
        duration_unit      : defaultExports.onChangeExpiry,
        start_date         : defaultExports.onChangeStartDate,
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
