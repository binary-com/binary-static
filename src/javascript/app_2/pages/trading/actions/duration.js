import moment from 'moment';
import ContractType from './helpers/contract_type';

export const onChangeExpiry = ({
    expiry_type,
    duration_unit,
    expiry_date,
    expiry_time,
    contract_type,
    server_time,
}) => {
    // TODO: for contracts that only have daily, date_expiry should have a minimum of daily, not intraday
    let contract_expiry_type = expiry_type === 'duration' && duration_unit === 'd' ? 'daily' : 'intraday';
    if (expiry_type === 'endtime') {
        const time    = ((expiry_time.split(' ') || [])[0] || '').split(':');
        const expires = moment(expiry_date).utc();
        if (time.length > 1) {
            expires.hour(time[0]).minute(time[1]);
        }
        if (expires.diff(moment(server_time).utc(), 'days') >= 1) {
            contract_expiry_type = 'daily';
        }
    }

    return {
        contract_expiry_type,
        ...(contract_type && ContractType.getBarriers(contract_type, contract_expiry_type)), // barrier value changes for intraday/daily
    };
};
