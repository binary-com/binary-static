import ContractType from './helpers/contract_type';

export const onChangeStartDate = ({ start_date }) => {
    const contract_start_type = ContractType.getStartType(start_date);

    return { ...contract_start_type };
};
