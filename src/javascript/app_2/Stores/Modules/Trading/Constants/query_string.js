import ContractType from '../Helpers/contract_type';

// list of trade's options that should be used in query string of trade page url.
export const getAllowedQueryStringVariables = (start_date) => {
    const { contract_start_type } = ContractType.getStartType(start_date);
    return [
        'amount',
        'barrier_1',
        'barrier_2',
        'basis',
        'contract_start_type',
        'contract_type',
        'duration',
        'duration_unit',
        'expiry_date',
        'expiry_type',
        'last_digit',
        'start_date',
        ...(contract_start_type === 'forward' ? ['start_time'] : []),
        'symbol',
    ];
};

export const getNonProposalQueryStringVariables = (start_date) => {
    const { contract_start_type } = ContractType.getStartType(start_date);
    return [
        'contract_start_type',
        'expiry_type',
        ...(contract_start_type === 'forward' ? ['start_time'] : []),
    ];
};

export const proposal_properties_alternative_names = {
    barrier    : is_digit => is_digit ? 'last_digit' : 'barrier_1',
    barrier2   : 'barrier_2',
    date_expiry: 'expiry_date',
    date_start : 'start_date',
};

export const removable_proposal_properties = [
    'currency',
    'passthrough',
    'proposal',
    'req_id',
    'subscribe',
];
