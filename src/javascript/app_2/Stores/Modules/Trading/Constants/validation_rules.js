import { localize } from '_common/localize';

const getValidationRules = () => ({
    amount: [
        ['req'    , { message: localize('Amount is a required field.') }],
        ['number' , { min: 0, type: 'float' }],
    ],
    barrier_1: [
        ['req'    , { condition: store => store.barrier_count && store.form_components.indexOf('barrier') > -1, message: localize('Barrier is a required field.') }],
        ['barrier', { condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count }],
        ['number' , { condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float' }],
        ['custom' , { func: (value, options, store) => store.barrier_count > 1 ? +value > +store.barrier_2 : true, message: localize('Higher barrier must be higher than lower barrier.') }],
    ],
    barrier_2: [
        ['req'    , { condition: store => store.barrier_count > 1 && store.form_components.indexOf('barrier') > -1, message: localize('Barrier is a required field.') }],
        ['barrier', { condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count }],
        ['number' , { condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float' }],
        ['custom' , { func: (value, options, store) => +store.barrier_1 > +value, message: localize('Lower barrier must be lower than higher barrier.') }],
    ],
    duration: [
        ['req'    , { message: localize('Duration is a required field.') }],
    ],
});

export default getValidationRules;
