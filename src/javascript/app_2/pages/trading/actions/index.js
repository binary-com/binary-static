import {
    action,
    flow,
    reaction }         from 'mobx';
import { cloneObject } from '../../../../_common/utility';

// add files containing actions here.
import * as ContractType from './contract_type';
import * as Currency     from './currency';
import * as Duration     from './duration';
import * as Proposal     from './proposal';
import * as StartDate    from './start_date';
import * as Symbol       from './symbol';
import * as Test         from './test';

const reaction_disposers = [];

const defaultExports = { ...ContractType, ...Currency, ...Duration, ...Proposal, ...Symbol, ...StartDate, ...Test };

const reaction_map = {
    symbol             : () => defaultExports.onChangeSymbolAsync,
    contract_types_list: () => defaultExports.onChangeContractTypeList,
    contract_type      : () => defaultExports.onChangeContractType,
    expiry_type        : () => defaultExports.onChangeExpiry,
    expiry_date        : () => defaultExports.onChangeExpiry,
    expiry_time        : () => defaultExports.onChangeExpiry,
    duration_unit      : () => defaultExports.onChangeExpiry,
    start_date         : () => defaultExports.onChangeStartDate,
    proposal           : () => defaultExports.onChangeProposalAsync,
};

export const initActions = (store) => {
    Object.keys(defaultExports).forEach((methodName) => {
        const method = defaultExports[methodName];

        if (/.*async$/i.test(methodName)) {
            defaultExports[methodName] = flow(function* (payload) {
                const snapshot = cloneObject(store);
                const new_state = yield flow(method)(snapshot, payload);
                updateStore(store, new_state);
            });
        } else {
            defaultExports[methodName] = action(methodName, (payload) => {
                const snapshot = cloneObject(store);
                const new_state = method(snapshot, payload);
                updateStore(store, new_state);
            });
        }
    });

    Object.keys(reaction_map).forEach((reaction_key) => {
        const disposer = reaction(
            () => (reaction_key in store.proposal ? store.proposal[reaction_key] : store[reaction_key]),
            reaction_map[reaction_key]());
        reaction_disposers.push(disposer);
    });
};

export const disposeActions = () => {
    reaction_disposers.forEach((disposer) => { disposer(); });
};

export const updateStore = (store, obj_new_values = {}) => {
    const new_state = cloneObject(obj_new_values);
    Object.keys(new_state).forEach((key) => {
        const source = key in store ? store : store.proposal;
        if (JSON.stringify(source[key]) === JSON.stringify(new_state[key])) {
            delete new_state[key];
        } else {
            source[key] = new_state[key];
        }
    });
};

export default defaultExports;
