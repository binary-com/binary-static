import React        from 'react';
import PropTypes    from 'prop-types';
import Fieldset     from '../../../components/form/fieldset.jsx';
import InputField   from '../../../components/form/input_field.jsx';
import { connect }  from '../../../store/connect';
import { localize } from '../../../../_common/localize';

const Barrier = ({
    barrier_count,
    barrier_1,
    barrier_2,
    onChange,
    is_minimized,
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
    barrier_count: PropTypes.number,
    barrier_1    : PropTypes.string,
    barrier_2    : PropTypes.string,
    is_minimized : PropTypes.bool,
    onChange     : PropTypes.func,
};

export default connect(
    ({ trade }) => ({
        barrier_count: trade.barrier_count,
        barrier_1    : trade.barrier_1,
        barrier_2    : trade.barrier_2,
        onChange     : trade.handleChange,
    })
)(Barrier);
