import React from 'react';
import { connect } from '../store/connect';

const Contracts = ({ list }) => (
    Object.keys(list).map((category, idx) => (
        <React.Fragment key={idx}>
            <optgroup key={idx} label={category} />
            {list[category].map(type => (
                <option key={type.name} value={type.name}>{type.title}</option>
            ))}
        </React.Fragment>
    ))
);

const Contract = ({
    contract_type,
    contract_types_list,
    onChange,
}) => (
    <fieldset>
        <select name='contract_type' value={contract_type} onChange={onChange}>
            <Contracts list={contract_types_list} />
        </select>
    </fieldset>
);

export default connect(
    ({trade}) => ({
        contract_type      : trade.contract_type,
        contract_types_list: trade.contract_types_list,
        onChange           : trade.handleChange,
    })
)(Contract);
