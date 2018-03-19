import React from 'react';
import Fieldset from './elements/fieldset.jsx';
import InputField from './form/input_field.jsx';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const Barrier = ({
    barrier_1,
    barrier_2,
    onChange,
    is_minimized,
}) =>  {
    if (is_minimized) {
        return (
            <div>Barrier: {barrier_1} {!!barrier_2 && barrier_2}</div>
        );
    }
    return (
    <Fieldset
        header={localize(barrier_2 ? 'High barrier' : 'Barrier')}
        icon='barriers'
        tooltip={localize('Text for Barriers goes here.')}
    >
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
    </Fieldset>
    );
};

export default connect(
    ({trade}) => ({
        barrier_1: trade.barrier_1,
        barrier_2: trade.barrier_2,
        onChange : trade.handleChange,
    })
)(Barrier);
