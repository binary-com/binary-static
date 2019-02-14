import { observer }   from 'mobx-react';
import PropTypes      from 'prop-types';
import React          from 'react';
import { localize }   from '_common/localize';
import NumberSelector from 'App/Components/Form/number_selector.jsx';
import Fieldset       from 'App/Components/Form/fieldset.jsx';

const LastDigit = ({
    is_minimized,
    last_digit,
    onChange,
}) =>  {
    if (is_minimized) {
        return (
            <div className='fieldset-minimized'>
                <span className='icon digits' />
                {`${localize('Last Digit')}: ${last_digit}`}
            </div>
        );
    }
    const arr_five = [...Array(5).keys()];
    return (
        <Fieldset
            className='trade-container__fieldset'
            header={localize('Last Digit Prediction')}
            is_center
        >
            <NumberSelector
                arr_arr_numbers={[arr_five, arr_five.map(i => i + 5)]}
                name='last_digit'
                onChange={onChange}
                selected_number={+last_digit}
            />
        </Fieldset>
    );
};

LastDigit.propTypes = {
    is_minimized: PropTypes.bool,
    last_digit  : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    onChange: PropTypes.func,
};

export default observer(LastDigit);
