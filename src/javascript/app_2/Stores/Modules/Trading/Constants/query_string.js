import ContractType from '../Helpers/contract_type';

// list of trade's options that should be used in query string of trade page url.
export const allowed_query_string_variables = [
    'advanced_duration',
    'advanced_duration_unit',
    'advanced_expiry_type',
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
    'is_equal_checked',
    'is_advanced_duration',
    'last_digit',
    'start_date',
    'start_time',
    'simple_duration',
    'simple_duration_unit',
    'symbol',
];

export const getNonProposalQueryStringVariables = (store) => {
    const non_proposal_query_string_variables = [
        'advanced_duration',
        'advanced_duration_unit',
        'advanced_expiry_type',
        'contract_start_type',
        'expiry_type',
        'is_advanced_duration',
        'simple_duration',
        'simple_duration_unit',
    ];

    if (!store) return non_proposal_query_string_variables;

    const { contract_start_type } = ContractType.getStartType(store.start_date);
    const { expiry_type } = store;
    return [
        ...non_proposal_query_string_variables,
        ...(contract_start_type === 'forward' ? ['start_time'] : []),
        ...(expiry_type         === 'endtime' ? ['expiry_date'] : []),
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
