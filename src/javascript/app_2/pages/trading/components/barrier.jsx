import React from 'react';
import Fieldset from '../../../components/form/fieldset.jsx';
import InputField from '../../../components/form/input_field.jsx';
import { connect } from '../../../store/connect';
import { localize } from '../../../../_common/localize';

const Barrier = ({
    barrier_1,
    barrier_2,
    onChange,
}) =>  (
    <Fieldset
        header={localize(barrier_2 ? 'High barrier' : 'Barrier')}
        icon='barriers'
        tooltip={localize('Text for Barriers goes here.')}
    >
        <InputField
            type='text'
            name='barrier_1'
            value={barrier_1}
            onChange={onChange}
        />

        {!!barrier_2 &&
            <InputField
                type='text'
                name='barrier_2'
                value={barrier_2}
                onChange={onChange}
            />
        }
    </Fieldset>
);

export default connect(
    ({trade}) => ({
        barrier_1: trade.barrier_1,
        barrier_2: trade.barrier_2,
        onChange : trade.handleChange,
    })
)(Barrier);
