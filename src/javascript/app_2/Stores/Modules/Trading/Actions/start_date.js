import ContractType from '../Helpers/contract_type';

export const onChangeStartDate = (store) => {
    const { contract_type, start_date, duration_unit, expiry_time, expiry_type } = store;
    let { start_time, expiry_date } = store;

    const obj_contract_start_type = ContractType.getStartType(start_date);
    const contract_start_type     = obj_contract_start_type.contract_start_type;
    const obj_sessions            = ContractType.getSessions(contract_type, start_date);
    const sessions                = obj_sessions.sessions;
    const obj_start_time          = ContractType.getStartTime(sessions, start_date, start_time);
    start_time                    = obj_start_time.start_time;

    const obj_duration_units_list = ContractType.getDurationUnitsList(contract_type, contract_start_type);
    const obj_duration_unit       = ContractType.getDurationUnit(duration_unit, contract_type, contract_start_type);

    const obj_expiry_date = ContractType.getExpiryDate(expiry_date, start_date, expiry_type);
    expiry_date           = obj_expiry_date.expiry_date;
    const obj_expiry_time = ContractType.getExpiryTime(sessions, start_date, start_time, expiry_date, expiry_time);

    const obj_duration_min_max = ContractType.getDurationMinMax(contract_type, contract_start_type);

    return {
        ...obj_contract_start_type,
        ...obj_duration_units_list,
        ...obj_duration_min_max,
        ...obj_duration_unit,
        ...sessions,
        ...obj_start_time,
        ...obj_expiry_date,
        ...obj_expiry_time,
    };
};
