import {
    action,
    flow,
    reaction }      from 'mobx';
import DAO          from '../../../data/dao';
import {
    cloneObject,
    isEmptyObject } from '../../../../_common/utility';

// add files containing actions here.
import * as ContractType from './contract_type';
import * as Currency     from './currency';
import * as Duration     from './duration';
import * as StartDate    from './start_date';
import * as Symbol       from './symbol';
import * as Test         from './test';

let should_send_proposal = 0;
const reaction_disposers = [];

const defaultExports = { ...ContractType, ...Currency, ...Duration, ...Symbol, ...StartDate, ...Test };

const reaction_map = {
    symbol             : () => defaultExports.onChangeSymbolAsync,
    contract_types_list: () => defaultExports.onChangeContractTypeList,
    contract_type      : () => defaultExports.onChangeContractType,
    expiry_type        : () => defaultExports.onChangeExpiry,
    expiry_date        : () => defaultExports.onChangeExpiry,
    expiry_time        : () => defaultExports.onChangeExpiry,
    duration_unit      : () => defaultExports.onChangeExpiry,
    start_date         : () => defaultExports.onChangeStartDate,
};

export const initActions = (store) => {
    Object.keys(defaultExports).forEach((methodName) => {
        const method = defaultExports[methodName];

        if (/.*async$/i.test(methodName)) {
            defaultExports[methodName] = flow(function* (payload) {
                const snapshot = cloneObject(store);
                const new_state = yield flow(method)(snapshot, payload);
                callProposalOnDidUpdate(store, new_state);
            });
        } else {
            defaultExports[methodName] = action(methodName, (payload) => {
                const snapshot = cloneObject(store);
                const new_state = method(snapshot, payload);
                callProposalOnDidUpdate(store, new_state);
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

const updateStore = (store, new_state) => {
    Object.keys(new_state).forEach((key) => {
        const source = key in store ? store : store.proposal;
        if (JSON.stringify(source[key]) === JSON.stringify(new_state[key])) {
            delete new_state[key];
        } else {
            source[key] = new_state[key];
        }
    });
    return new_state;
};

const proposal_fields = ['amount', 'basis', 'currency', 'symbol', 'start_date', 'start_time', 'duration', 'duration_unit', 'expiry_type', 'expiry_date', 'expiry_time', 'barrier_1', 'barrier_2', 'last_digit'];

// TODO: improve this logic in case of any exceptions that are found
export const callProposalOnDidUpdate = (store, obj_new_values = {}) => {
    // first update store. only values that were changed will be stored in new_store
    const new_store = updateStore(store, cloneObject(obj_new_values));

    // if a new value that is being updated in store is part of proposal
    if (Object.keys(obj_new_values).find(key => proposal_fields.indexOf(key) !== -1)) {
        // see if any of the new values that were updated in store will trigger some other values to be updated
        const in_reaction = Object.keys(new_store).find(key => key in reaction_map);

        // if it's going to update other values, flag it to send proposal in future after those values are updated
        if (in_reaction === 'symbol') {
            should_send_proposal = 1;
            return;
        }

        // if we have a flag from before, or there is a new value in store related to proposal that didn't need to trigger anything else
        if (should_send_proposal || !isEmptyObject(new_store)) {
            should_send_proposal = 0;
            DAO.forgetAll('proposal').then(() => {
                const proposalCallback = (response) => {
                    const id      = response.error ? '' : response.proposal.id;
                    const message = response.error ? response.error.message : response.proposal.longcode;
                    store.proposals[response.echo_req.contract_type] = { id, message };
                };

                Object.keys(store.trade_types).forEach(type => {
                    DAO.subscribeProposal(store, type, proposalCallback);
                });
            });
        }
    }
};

export default defaultExports;
