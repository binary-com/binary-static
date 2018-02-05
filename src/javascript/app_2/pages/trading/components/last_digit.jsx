import React from 'react';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const LastDigit = ({
    last_digit,
    last_digit_visible,
    onChange,
}) =>  (
    last_digit_visible ?
    <fieldset>
        <label>{localize('Last Digit Prediction')}</label>
        <select name='last_digit' value={last_digit} onChange={onChange}>
            {[...Array(10).keys()].map((number) => (
                <option key={number} value={number}>{number}</option>
            ))}
        </select>
    </fieldset> :
    ''
);

export default connect(
    ({trade}) => ({
        last_digit        : trade.last_digit,
        last_digit_visible: trade.last_digit_visible,
        onChange          : trade.handleChange,
    })
)(LastDigit);
