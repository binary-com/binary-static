import moment       from 'moment';
import ContractType from './helpers/contract_type';

export const onChangeExpiry = (store) => {
    const { contract_type, duration_unit, expiry_date, expiry_type } = store;
    const server_time = store.main_store.common.server_time;

    const duration_is_day       = expiry_type === 'duration' && duration_unit === 'd';
    const expiry_is_after_today = expiry_type === 'endtime' && moment.utc(expiry_date).isAfter(moment(server_time).utc(), 'day');

    let contract_expiry_type = 'daily';
    if (!duration_is_day && !expiry_is_after_today) {
        contract_expiry_type = duration_unit === 't' ? 'tick' : 'intraday';
    }

    // TODO: there will be no barrier available if contract is only daily but client chooses intraday endtime. we should find a way to handle this.
    const obj_barriers = store.contract_expiry_type !== contract_expiry_type && // barrier value changes for tick/intraday/daily
        ContractType.getBarriers(contract_type, contract_expiry_type);

    return {
        contract_expiry_type,
        ...obj_barriers,
    };
};
