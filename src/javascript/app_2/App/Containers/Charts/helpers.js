import { toJS }          from 'mobx';
import { WS }            from '../../../Services';
import { isEmptyObject } from '../../../../_common/utility';

export const subscribe = (request_object, callback) => {
    if (request_object.subscribe !== 1) return;
    WS.subscribeTicksHistory(request_object, callback);
};

export const forget = (match_values, callback) => (
    WS.forget('ticks_history', callback, match_values)
);

export const barriersObjectToArray = (barriers) => (
    Object.keys(barriers || {})
        .map(key => toJS(barriers[key]))
        .filter(item => !isEmptyObject(item))
);
