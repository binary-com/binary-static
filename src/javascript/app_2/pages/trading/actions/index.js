import { useStrict, action, reaction } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { cloneObject, isEmptyObject } from '../../../../_common/utility';
import DAO from '../../../data/dao';

// add files containing actions here.
import * as ContractType from './contract_type';
import * as Currency from './currency';
import * as Duration from './duration';
import * as StartDate from './start_date';
import * as Symbol from './symbol';
import * as Test from './test';

useStrict(true);

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
            defaultExports[methodName] = asyncAction(`${methodName}.wrapper`, function* (payload) {
                const snapshot = cloneObject(store);
                const new_state = yield asyncAction(methodName, method)(snapshot, payload);
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
        const disposer = reaction(() => store[reaction_key], reaction_map[reaction_key]());
        reaction_disposers.push(disposer);
    });
};

export const disposeActions = () => {
    reaction_disposers.forEach((disposer) => { disposer(); });
};

const updateStore = (store, new_state) => {
    Object.keys(new_state).forEach((key) => {
        if (JSON.stringify(store[key]) === JSON.stringify(new_state[key])) {
            delete new_state[key];
        } else {
            store[key] = new_state[key];
        }
    });
    return new_state;
};

const proposal_fields = ['amount', 'basis', 'currency', 'symbol', 'start_date', 'start_time', 'duration', 'duration_unit', 'expiry_type', 'expiry_date', 'expiry_time', 'barrier_1', 'barrier_2', 'last_digit'];

// TODO: find instances such as datepicker value changes which cause proposal to be sent twice
export const callProposalOnDidUpdate = (store, obj_new_values = {}) => {
    const new_store = updateStore(store, cloneObject(obj_new_values));
    if (Object.keys(obj_new_values).find(key => proposal_fields.indexOf(key) !== -1)) {
        console.log(obj_new_values, new_store);
        const in_reaction = Object.keys(new_store).find(key => key in reaction_map);
        if (in_reaction) {
            should_send_proposal = 1;
            console.log('set flag and return', in_reaction);
            return;
        }
        if (should_send_proposal || !isEmptyObject(new_store)) {
            console.log('sending proposal', should_send_proposal);
            should_send_proposal = 0;
            DAO.forgetAll('proposal').then(() => {
                Object.keys(store.trade_types).forEach(type => {
                    DAO.subscribeProposal(store, type, proposalCallback);
                });
            });
        }
    }
};


const proposalCallback = () => {
    // if (response.error) {
    //     console.log(response.error);
    // } else {
    //     console.log(response.proposal.longcode);
    // }
};

export default defaultExports;
