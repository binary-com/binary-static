import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import Fieldset     from '../../../../../App/Components/Form/fieldset.jsx';
import InputField   from '../../../../../App/Components/Form/input_field.jsx';
import { localize } from '../../../../../../_common/localize';

const Barrier = ({
    barrier_1,
    barrier_2,
    barrier_count,
    is_minimized,
    onChange,
}) =>  {
    if (is_minimized) {
        if (barrier_count !== 2) {
            return (
                <div className='fieldset-minimized barrier1'>
                    <span className='icon barriers' />
                    {barrier_1}
                </div>
            );
        }
        return (
            <React.Fragment>
                <div className='fieldset-minimized barrier1'>
                    <span className='icon barriers' />
                    {barrier_1}
                </div>
                <div className='fieldset-minimized barrier2'>
                    <span className='icon barriers' />
                    {barrier_2}
                </div>
            </React.Fragment>
        );
    }
    return (
        <Fieldset
            header={localize(barrier_count > 1 ? 'Barriers' : 'Barrier')}
            icon='barriers'
        >
            <InputField
                type='text'
                name='barrier_1'
                value={barrier_1}
                onChange={onChange}
            />

            {barrier_count === 2 &&
                <InputField
                    type='text'
                    name='barrier_2'
                    value={barrier_2}
                    onChange={onChange}
                    is_currency
                />
            }
        </Fieldset>
    );
};

Barrier.propTypes = {
    barrier_1    : PropTypes.string,
    barrier_2    : PropTypes.string,
    barrier_count: PropTypes.number,
    is_minimized : PropTypes.bool,
    onChange     : PropTypes.func,
};

export default observer(Barrier);
