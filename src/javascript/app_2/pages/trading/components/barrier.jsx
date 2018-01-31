import React from 'react';
import { InputField } from './form/text_field.jsx';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const Barrier = ({
    barrier_1,
    barrier_2,
    onChange,
}) =>  (
        <fieldset>
            <label htmlFor='barrier_1'>{localize(barrier_2 ? 'High barrier' : 'Barrier')}</label>
            <InputField type='number' name='barrier_1' value={barrier_1} o_change={onChange} />

            {!!barrier_2 &&
                <React.Fragment>
                    <label htmlFor='barrier_2'>{localize('Low barrier')}</label>
                    <InputField type='number' name='barrier_2' value={barrier_2} on_change={onChange} />
                undefined
                </React.Fragment>
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
