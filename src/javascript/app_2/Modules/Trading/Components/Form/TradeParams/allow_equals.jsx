import React          from 'react';
import { observer }   from 'mobx-react';
import PropTypes      from 'prop-types';
import { localize }   from '_common/localize';
import Tooltip        from 'App/Components/Elements/tooltip.jsx';
import InputField     from 'App/Components/Form/input_field.jsx';

const AllowEquals = ({
    is_allow_equal,
    onChange,
}) => (
    !!is_allow_equal &&
        <div className='allow-equals'>
            <InputField
                id='allow_equals'
                name='contract_type'
                onChange={onChange}
                value='is_equal'
                type='checkbox'
            />
            <label htmlFor='allow_equals'>{localize('Allow equals')}</label>
            <Tooltip icon='info' message={localize('Win payout if exit spot is also equal to entry spot.')} alignment='left' />
        </div>
);

AllowEquals.propTypes = {
    is_allow_equal: PropTypes.bool,
    onChange      : PropTypes.func,
};

export default observer(AllowEquals);
