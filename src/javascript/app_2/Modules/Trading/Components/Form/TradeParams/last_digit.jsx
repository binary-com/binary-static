import { observer }  from 'mobx-react';
import PropTypes     from 'prop-types';
import React         from 'react';
import { localize }  from '_common/localize';
import DigitSelector from 'App/Components/Form/digit_selector.jsx';
import Fieldset      from 'App/Components/Form/fieldset.jsx';

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
    return (
        <Fieldset
            header={localize('Last Digit Prediction')}
            is_center
        >
            <DigitSelector
                name='last_digit'
                onChange={onChange}
                selected_digit={+last_digit}
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
