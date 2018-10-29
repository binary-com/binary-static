import { localize } from '_common/localize';

const getValidationRules = () => ({
    amount: {
        rules: [
            ['req'    , { message: localize('Amount is a required field.') }],
            ['number' , { min: 0, type: 'float' }],
        ],
    },
    barrier_1: {
        rules: [
            ['req'    , { condition: store => store.barrier_count && store.form_components.indexOf('barrier') > -1, message: localize('Barrier is a required field.') }],
            ['barrier', { condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count }],
            ['number' , { condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float' }],
            ['custom' , { func: (value, options, store, inputs) => store.barrier_count > 1 ? +value > +inputs.barrier_2 : true, message: localize('Higher barrier must be higher than lower barrier.') }],
        ],
        trigger: 'barrier_2',
    },
    barrier_2: {
        rules: [
            ['req'    , { condition: store => store.barrier_count > 1 && store.form_components.indexOf('barrier') > -1, message: localize('Barrier is a required field.') }],
            ['barrier', { condition: store => store.contract_expiry_type !== 'daily' && store.barrier_count }],
            ['number' , { condition: store => store.contract_expiry_type === 'daily' && store.barrier_count, type: 'float' }],
            ['custom', { func: (value, options, store, inputs) => (/^[+-]/g.test(inputs.barrier_1) && /^[+-]/g.test(value)) || (/^(?![+-])/g.test(inputs.barrier_1) && /^(?![+-])/g.test(value)), message: localize('Both barriers should be relative or absolute') }],
            ['custom' , { func: (value, options, store, inputs) => +inputs.barrier_1 > +value, message: localize('Lower barrier must be lower than higher barrier.') }],
        ],
        trigger: 'barrier_1',
    },
    duration: {
        rules: [
            ['req'    , { message: localize('Duration is a required field.') }],
        ],
    },
});

export default getValidationRules;
