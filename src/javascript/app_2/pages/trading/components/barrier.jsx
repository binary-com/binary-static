import React from 'react';
import InputField from './form/input_field.jsx';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const Barrier = ({
    barrier_1,
    barrier_2,
    onChange,
}) =>  (
        <fieldset>
            <span className='field-info left' htmlFor='barrier_1'>
                {localize(barrier_2 ? 'High barrier' : 'Barrier')}
            </span>
            <InputField
                type='number'
                name='barrier_1'
                value={barrier_1}
                onChange={onChange}
                is_currency
            />

            {!!barrier_2 &&
                <InputField
                    type='number'
                    name='barrier_2'
                    value={barrier_2}
                    onChange={onChange}
                    is_currency
                />
            }
        </fieldset>
);

export default connect(
    ({trade}) => ({
        barrier_1: trade.barrier_1,
        barrier_2: trade.barrier_2,
        onChange : trade.handleChange,
    })
)(Barrier);
