const validation_rules = {
    amount: [
        ['req'    , {message: 'The amount is a required field.'}],
        ['number' , {min: 0, type: 'float'}],
    ],
    barrier_1: [
        ['req'    , {condition: store => store.barrier_count, message: 'The barrier is a required field.'}],
        ['barrier', {condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count}],
        ['number' , {condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float'}],
    ],
    barrier_2: [
        ['req'    , {condition: store => store.barrier_count, message: 'The barrier is a required field.'}],
        ['barrier', {condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count}],
        ['number' , {condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float'}],
    ],
    duration: [
        ['req'    , {message: 'The duration is a required field.'}],
    ],
};

export default validation_rules;
