import moment       from 'moment';
import ContractType from './helpers/contract_type';

export const onChangeExpiry = (store) => {
    const { contract_type, duration_unit, expiry_date, expiry_type } = store.proposal;
    const duration_is_day       = expiry_type === 'duration' && duration_unit === 'd';
    const expiry_is_after_today = expiry_type === 'endtime' && moment.utc(expiry_date).isAfter(moment(store.server_time).utc(), 'day');
    const contract_expiry_type  = duration_is_day || expiry_is_after_today ? 'daily' : 'intraday';

    return {
        contract_expiry_type,
        // TODO: there will be no barrier available if contract is only daily but client chooses intraday endtime. we should find a way to handle this.
        ...(contract_type && ContractType.getBarriers(contract_type, contract_expiry_type)), // barrier value changes for intraday/daily
    };
};
