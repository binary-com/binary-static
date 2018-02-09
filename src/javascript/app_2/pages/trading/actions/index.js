import { useStrict } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { cloneObject } from '../../../../_common/utility';

// add files containing actions here.
import * as currency from './currency';

useStrict(true);

const defaultExports = { };

function addToExports(list, store) {
    Object.keys(list).forEach((methodName) => {
        const method = list[methodName];

        defaultExports[methodName] = asyncAction(`${methodName}.wrapper`, function* (payload) {
            const snapshot = cloneObject(store);
            const new_state = yield asyncAction(methodName, method)(snapshot, payload);
            Object.keys(new_state).forEach((key) => {
                store[key] = new_state[key];
            });
        });
    });
}

export const initActions = (store) => {
    addToExports(currency, store);
};

export default defaultExports;