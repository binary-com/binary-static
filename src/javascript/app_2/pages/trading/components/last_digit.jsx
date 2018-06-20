import React        from 'react';
import PropTypes    from 'prop-types';
import Dropdown     from '../../../components/form/dropdown.jsx';
import Fieldset     from '../../../components/form/fieldset.jsx';
import { connect }  from '../../../store/connect';
import { localize } from '../../../../_common/localize';

const last_digit_numbers = [...Array(10).keys()].map(number => ({
    text : number,
    value: number,
}));

const LastDigit = ({
    last_digit,
    onChange,
    is_nativepicker,
    is_minimized,
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
                value={last_digit}
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
    last_digit     : PropTypes.number,
    onChange       : PropTypes.func,
};

export default connect(
    ({ trade }) => ({
        last_digit: trade.last_digit,
        onChange  : trade.handleChange,
    })
)(LastDigit);
