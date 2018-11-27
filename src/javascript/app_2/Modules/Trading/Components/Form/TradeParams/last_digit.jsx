import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from '_common/localize';
import Dropdown     from 'App/Components/Form/DropDown';
import Fieldset     from 'App/Components/Form/fieldset.jsx';

const last_digit_numbers = [...Array(10).keys()].map(number => ({
    text : number,
    value: number,
}));

const LastDigit = ({
    is_minimized,
    is_nativepicker,
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
            icon='digits'
        >
            <Dropdown
                list={last_digit_numbers}
                value={+last_digit}
                name='last_digit'
                onChange={onChange}
                is_nativepicker={is_nativepicker}
            />
        </Fieldset>
    );
};

LastDigit.propTypes = {
    is_minimized   : PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    last_digit     : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    onChange: PropTypes.func,
};

export default observer(LastDigit);
