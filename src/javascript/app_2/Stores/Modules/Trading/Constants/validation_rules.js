const validation_rules = {
    amount: [
        ['number' , {min: 0, type: 'float'}],
        ['req'    , {message: 'The amount is a required field.'}],
    ],
    barrier_1: [
        ['barrier', {condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count}],
        ['number' , {condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float'}],
        ['req'    , {condition: store => store.barrier_count, message: 'The barrier is a required field.'}],
    ],
    barrier_2: [
        ['barrier', {condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count}],
        ['number' , {condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float'}],
        ['req'    , {condition: store => store.barrier_count, message: 'The barrier is a required field.'}],
    ],
    duration: [
        ['req'    , {message: 'The duration is a required field.'}],
    ],
};

export default validation_rules;
