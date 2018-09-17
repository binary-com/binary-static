const validation_rules = {
    amount: [
        ['req'    , { message: 'The amount is a required field.' }],
        ['number' , { min: 0, type: 'float' }],
    ],
    barrier_1: [
        ['req'    , { condition: store => store.barrier_count && store.form_components.indexOf('barrier') > -1, message: 'The barrier is a required field.' }],
        ['barrier', { condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count }],
        ['number' , { condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float' }],
        ['custom' , { func: (value, options, store) => store.barrier_count > 1 ? +value > +store.barrier_2 : true, message: 'The higher barrier must be higher than the lower barrier.' }],
    ],
    barrier_2: [
        ['req'    , { condition: store => store.barrier_count > 1 && store.form_components.indexOf('barrier') > -1, message: 'The barrier is a required field.' }],
        ['barrier', { condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count }],
        ['number' , { condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float' }],
        ['custom' , { func: (value, options, store) => +store.barrier_1 > +value, message: 'The lower barrier must be lower than the higher barrier.' }],
    ],
    duration: [
        ['req'    , { message: 'The duration is a required field.' }],
    ],
};

export default validation_rules;
