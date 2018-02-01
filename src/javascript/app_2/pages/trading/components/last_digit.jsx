import React from 'react';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const LastDigit = ({
    last_digit,
    onChange,
}) =>  (
        <fieldset>
            <label htmlFor='last_digit'>{localize('Last Digit Prediction')}</label>
            <select name='last_digit' value={last_digit} onChange={onChange}>
                {Array.from(new Array(10)).map((x, i) => (
                    <option key={i} value={i}>{i}</option>
                ))}
            </select>
        </fieldset>
);

export default connect(
    ({trade}) => ({
        last_digit: trade.last_digit,
        onChange  : trade.handleChange,
    })
)(LastDigit);
