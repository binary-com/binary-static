import React from 'react';
import { connect } from '../store/connect';

const Symbol = ({
    symbol,
    symbols_list,
    onChange,
}) =>  (
    <fieldset>
        <select name='symbol' value={symbol} onChange={onChange}>
            {Object.keys(symbols_list).map(s => (
                <option key={s} value={s}>{symbols_list[s]}</option>
            ))};
        </select>
    </fieldset>
);

export default connect(
    ({trade}) => ({
        symbol      : trade.symbol,
        symbols_list: trade.symbols_list,
        onChange    : trade.handleChange,
    })
)(Symbol);
