import React from 'react';
import { connect } from '../store/connect';
import { localize } from '../../../../_common/localize';

const Contracts = ({ list }) => (
    Object.keys(list).map((category, idx) => (
        <React.Fragment key={idx}>
            <optgroup key={idx} label={category}></optgroup>
            {list[category].map(type => (
                <option key={type} value={type}>{type}</option>
            ))}
        </React.Fragment>
    ))
);

const Contract = ({
    contract_type,
    contract_types_list,
    onChange,
}) => (
        <select name='contract_type' value={contract_type} onChange={onChange}>
            <Contracts list={contract_types_list} />
        </select>
);

export default connect(
    ({trade}) => ({
        contract_type      : trade.contract_type,
        contract_types_list: trade.contract_types_list,
        onChange           : trade.handleChange,
    })
)(Contract);
