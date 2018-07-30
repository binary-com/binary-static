import { toJS }            from 'mobx';
import { CONTRACT_SHADES } from '../Constants/barrier_shades';
import { isEmptyObject }   from '../../../../../_common/utility';

export const isBarrierSupported = (contract_type) => contract_type in CONTRACT_SHADES;

export const barriersToString = (is_relative, ...barriers_list) => barriers_list.map(
    barrier => `${is_relative && !/^[+-]/.test(barrier) ? '+' : ''}${barrier}`
);

export const barriersObjectToArray = (barriers) => (
    Object.keys(barriers || {})
        .map(key => toJS(barriers[key]))
        .filter(item => !isEmptyObject(item))
);
