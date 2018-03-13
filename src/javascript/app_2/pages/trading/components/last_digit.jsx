import React from 'react';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';
import Dropdown from './form/dropdown.jsx';

const last_digit_numbers = [...Array(10).keys()].map(number => ({
    text : number,
    value: number,
}));

const LastDigit = ({
    last_digit,
    onChange,
}) =>  (
    <fieldset>
        <div className='fieldset-header'>
            <span className='field-info left' htmlFor='last_digit'>
                {localize('Last Digit Prediction')}
            </span>
        </div>
        <Dropdown
            list={last_digit_numbers}
            value={last_digit}
            name='last_digit'
            onChange={onChange}
        />
    </fieldset>
);

export default connect(
    ({trade}) => ({
        last_digit: trade.last_digit,
        onChange  : trade.handleChange,
    })
)(LastDigit);
