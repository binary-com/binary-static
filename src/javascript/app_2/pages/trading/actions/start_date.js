import ContractType from './helpers/contract_type';

export const onChangeStartDate = ({ contract_type, start_date, duration_unit }) => {
    const obj_contract_start_type = ContractType.getStartType(start_date);
    const obj_duration_units_list =
              ContractType.getDurationUnitsList(contract_type, obj_contract_start_type.contract_start_type);
    const obj_duration_unit =
              ContractType.getDurationUnit(duration_unit, contract_type, obj_contract_start_type.contract_start_type);

    return { ...obj_contract_start_type, ...obj_duration_units_list, ...obj_duration_unit };
};
