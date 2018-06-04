import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from '../../../store/connect';

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

Symbol.propTypes = {
    onChange    : PropTypes.func,
    symbol      : PropTypes.string,
    symbols_list: PropTypes.object,
};

export default connect(
    ({trade}) => ({
        symbol      : trade.symbol,
        symbols_list: trade.symbols_list,
        onChange    : trade.handleChange,
    })
)(Symbol);
