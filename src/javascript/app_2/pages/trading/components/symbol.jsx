import React from 'react';
import { connect } from '../store/connect';

const Symbol = ({
    symbol,
    symbol_list,
    onChange,
}) =>  (
    <fieldset>
        <select name='symbol' value={symbol} onChange={onChange}>
            {Object.keys(symbol_list).map(s => (
                <option key={s} value={s}>{symbol_list[s]}</option>
            ))};
        </select>
    </fieldset>
);

export default connect(
    ({trade}) => ({
        symbol     : trade.symbol,
        symbol_list: trade.symbol_list,
        onChange   : trade.handleChange,
    })
)(Symbol);
