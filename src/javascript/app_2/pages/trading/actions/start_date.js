import ContractType from './helpers/contract_type';

export const onChangeStartDate = (store) => {
    const { contract_type, start_date, duration_unit, start_time } = store;

    const obj_contract_start_type = ContractType.getStartType(start_date);
    const obj_duration_units_list =
              ContractType.getDurationUnitsList(contract_type, obj_contract_start_type.contract_start_type);
    const obj_duration_unit =
              ContractType.getDurationUnit(duration_unit, contract_type, obj_contract_start_type.contract_start_type);
    const obj_sessions    = ContractType.getSessions(contract_type, start_date);
    const obj_start_time  = ContractType.getStartTime(obj_sessions.sessions, start_date, start_time);

    return {
        ...obj_contract_start_type,
        ...obj_duration_units_list,
        ...obj_duration_unit,
        ...obj_sessions,
        ...obj_start_time,
    };
};
