import React          from 'react';
import PropTypes      from 'prop-types';
import { localize }   from '_common/localize';
import Tooltip        from 'App/Components/Elements/tooltip.jsx';
import InputField     from 'App/Components/Form/input-field.jsx';

const AllowEquals = ({
    is_allow_equal,
    checked,
    onChange,
}) => (
    !!is_allow_equal &&
        <div className='allow-equals'>
            <InputField
                className='allow-equals__input-field'
                classNameInput='allow-equals__input trade-container__input'
                id='allow_equals'
                name='contract_type'
                onChange={onChange}
                value='is_equal'
                type='checkbox'
                checked={checked}
            />
            <label className='allow-equals__label' htmlFor='allow_equals'>{localize('Allow equals')}</label>
            <Tooltip
                alignment='left'
                className='allow-equals__tooltip'
                classNameIcon='allow-equals__tooltip-info'
                icon='info'
                message={localize('Win payout if exit spot is also equal to entry spot.')}
            />
        </div>
);

AllowEquals.propTypes = {
    checked       : PropTypes.number,
    is_allow_equal: PropTypes.bool,
    onChange      : PropTypes.func,
};

export default AllowEquals;
